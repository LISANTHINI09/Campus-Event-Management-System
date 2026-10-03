import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import Modal from './Modal';
import {
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Smartphone,
  Landmark,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Hash,
  Loader2
} from 'lucide-react';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Canara Bank',
  'Bank of Baroda'
];

const generateDemoReference = () => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let ref = 'PAY-DEMO-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

const RegistrationFlowModal = ({ isOpen, onClose, event, currentUser, onSuccess }) => {
  const navigate = useNavigate();

  // Steps: 1 = Participant Details, 2 = Review Details, 3 = Demo Payment (for paid), 4 = Success Page
  const [step, setStep] = useState(1);

  // Participant Form Data
  const [participant, setParticipant] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: 'CSE',
    year: '1st Year',
    collegeName: '',
    rollNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Payment Form Data
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NETBANKING
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8821 9012 3456');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Payment simulation state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [registrationResult, setRegistrationResult] = useState(null);

  const isPaidEvent = event && Number(event.registrationFee) > 0;
  const eventFee = isPaidEvent ? Number(event.registrationFee) : 0;

  // Pre-fill participant data when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setServerError('');
      setErrors({});
      setPaymentProcessing(false);
      setPaymentSuccessNotice(false);
      setRegistrationResult(null);

      const name = currentUser?.name || '';
      const email = currentUser?.email || '';
      const phone = currentUser?.phoneNumber || '';
      const dept = currentUser?.department || 'CSE';
      const yr = currentUser?.year || '1st Year';
      const col = currentUser?.collegeName || 'Campus Engineering College';

      setParticipant({
        fullName: name,
        email: email,
        phoneNumber: phone,
        department: dept,
        year: yr,
        collegeName: col,
        rollNumber: '',
      });

      setUpiId(email ? `${email.split('@')[0]}@okaxis` : 'student@oksbi');
      setCardHolder(name || 'Participant Name');
    }
  }, [isOpen, currentUser, event]);

  if (!isOpen || !event) return null;

  const handleParticipantChange = (e) => {
    const { name, value } = e.target;
    setParticipant((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateParticipant = () => {
    const errs = {};
    if (!participant.fullName.trim()) {
      errs.fullName = 'Participant full name is required';
    }
    if (!participant.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!participant.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(participant.phoneNumber.trim())) {
      errs.phoneNumber = 'Phone number must be a valid 10-digit number';
    }
    if (!participant.department) {
      errs.department = 'Department is required';
    }
    if (!participant.year) {
      errs.year = 'Academic year is required';
    }
    if (!participant.collegeName.trim()) {
      errs.collegeName = 'College name is required';
    }
    if (!participant.rollNumber.trim()) {
      errs.rollNumber = 'Roll Number / Register Number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (validateParticipant()) {
      setStep(2);
    }
  };

  // Final submission for Free events directly from Review (Step 2)
  const handleConfirmFreeRegistration = async () => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const payload = {
        studentId: currentUser.id,
        eventId: event.id,
        fullName: participant.fullName.trim(),
        email: participant.email.trim(),
        phoneNumber: participant.phoneNumber.trim(),
        department: participant.department,
        year: participant.year,
        collegeName: participant.collegeName.trim(),
        rollNumber: participant.rollNumber.trim(),
        paymentStatus: 'NOT_REQUIRED',
        paymentReference: null,
      };

      const result = await registrationService.registerForEvent(payload);
      setRegistrationResult({
        ...result,
        paymentStatus: 'NOT_REQUIRED',
        paymentReference: null,
      });
      setStep(4);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo payment processing for paid events (Step 3)
  const handleProcessPayment = () => {
    // Validate demo payment input
    if (paymentMethod === 'UPI' && !upiId.trim()) {
      setServerError('Please enter a valid UPI ID (e.g., student@okaxis)');
      return;
    }
    if (paymentMethod === 'CARD' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardHolder.trim())) {
      setServerError('Please fill out all card details');
      return;
    }
    if (paymentMethod === 'NETBANKING' && !selectedBank) {
      setServerError('Please select your bank');
      return;
    }

    setServerError('');
    setPaymentProcessing(true);

    const generatedRef = generateDemoReference();

    // Simulate 1.2 second payment gateway processing
    setTimeout(async () => {
      setPaymentProcessing(false);
      setPaymentSuccessNotice(true);

      try {
        const payload = {
          studentId: currentUser.id,
          eventId: event.id,
          fullName: participant.fullName.trim(),
          email: participant.email.trim(),
          phoneNumber: participant.phoneNumber.trim(),
          department: participant.department,
          year: participant.year,
          collegeName: participant.collegeName.trim(),
          rollNumber: participant.rollNumber.trim(),
          paymentStatus: 'PAID',
          paymentReference: generatedRef,
        };

        const result = await registrationService.registerForEvent(payload);
        setRegistrationResult({
          ...result,
          paymentStatus: 'PAID',
          paymentReference: generatedRef,
        });

        // Briefly show payment success badge before transitioning to confirmation
        setTimeout(() => {
          setStep(4);
          if (onSuccess) onSuccess(result);
        }, 800);
      } catch (err) {
        setServerError(err.message || 'Payment simulation failed to register. Please try again.');
        setPaymentSuccessNotice(false);
      }
    }, 1200);
  };

  const getModalTitle = () => {
    switch (step) {
      case 1:
        return 'Participant Details — Step 1 of 3';
      case 2:
        return 'Review & Confirm — Step 2 of 3';
      case 3:
        return 'Demo Payment Simulation — Step 3 of 3';
      case 4:
        return 'Registration Confirmed';
      default:
        return 'Event Registration';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 4 ? onClose : onClose}
      title={getModalTitle()}
      footer={null}
    >
      <div className="registration-flow-container">
        {serverError && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* STEP 1: PARTICIPANT DETAILS FORM */}
        {step === 1 && (
          <form onSubmit={handleNextToReview} className="participant-details-form">
            <div className="flow-event-highlight">
              <div>
                <span className="badge badge-category">{event.category}</span>
                <h4 style={{ margin: '4px 0 2px 0', fontSize: '1.1rem' }}>{event.eventName}</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  {event.eventDate} ({event.startTime}) • {event.venue}
                </p>
              </div>
              <div className="flow-fee-badge-box">
                {isPaidEvent ? (
                  <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.9rem', padding: '6px 12px', fontWeight: 600 }}>
                    Fee: ₹{eventFee}
                  </span>
                ) : (
                  <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.9rem', padding: '6px 12px', fontWeight: 600 }}>
                    Fee: Free
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
              ℹ️ Personal details have been pre-filled from your student profile. Please review and provide your Roll / Register Number.
            </p>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Participant Full Name"
                  value={participant.fullName}
                  onChange={handleParticipantChange}
                />
              </div>
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="student@campus.edu"
                    value={participant.email}
                    onChange={handleParticipantChange}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="10-digit Phone"
                    value={participant.phoneNumber}
                    onChange={handleParticipantChange}
                    maxLength="10"
                  />
                </div>
                {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Department & Year Grid */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Department <span className="required-star">*</span>
                </label>
                <select
                  name="department"
                  className="form-control"
                  value={participant.department}
                  onChange={handleParticipantChange}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="form-error">{errors.department}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Academic Year <span className="required-star">*</span>
                </label>
                <select
                  name="year"
                  className="form-control"
                  value={participant.year}
                  onChange={handleParticipantChange}
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                {errors.year && <p className="form-error">{errors.year}</p>}
              </div>
            </div>

            {/* College Name & Roll Number Grid */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  College Name <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <input
                    type="text"
                    name="collegeName"
                    className="form-control"
                    placeholder="College / Institute Name"
                    value={participant.collegeName}
                    onChange={handleParticipantChange}
                  />
                </div>
                {errors.collegeName && <p className="form-error">{errors.collegeName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Roll / Register Number <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Hash size={18} className="input-icon" />
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-control"
                    placeholder="e.g. CS-2023-042"
                    value={participant.rollNumber}
                    onChange={handleParticipantChange}
                  />
                </div>
                {errors.rollNumber && <p className="form-error">{errors.rollNumber}</p>}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', paddingBottom: 0 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <span>Review Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW DETAILS SECTION */}
        {step === 2 && (
          <div className="review-details-section">
            <p className="modal-intro" style={{ marginBottom: '1rem' }}>
              Please carefully review your participant and event information before final registration:
            </p>

            <div className="review-cards-container">
              {/* Event Summary Card */}
              <div className="review-box event-review-box">
                <h4 className="review-box-title">Event Information</h4>
                <div className="review-rows-grid">
                  <div className="review-item">
                    <span className="review-label">Event:</span>
                    <strong className="review-value">{event.eventName}</strong>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Category:</span>
                    <span className="review-value">{event.category}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Date:</span>
                    <span className="review-value">{event.eventDate} ({event.startTime})</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Venue:</span>
                    <span className="review-value">{event.venue}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Registration Fee:</span>
                    <span className="review-value">
                      {isPaidEvent ? (
                        <strong style={{ color: '#4338ca' }}>₹{eventFee}</strong>
                      ) : (
                        <strong style={{ color: '#15803d' }}>Free (₹0)</strong>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Participant Summary Card */}
              <div className="review-box participant-review-box">
                <h4 className="review-box-title">Participant Details</h4>
                <div className="review-rows-grid">
                  <div className="review-item">
                    <span className="review-label">Participant:</span>
                    <strong className="review-value">{participant.fullName}</strong>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Email:</span>
                    <span className="review-value">{participant.email}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Phone:</span>
                    <span className="review-value">{participant.phoneNumber}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Department:</span>
                    <span className="review-value">{participant.department} ({participant.year})</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">College:</span>
                    <span className="review-value">{participant.collegeName}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Roll Number:</span>
                    <strong className="review-value">{participant.rollNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Notice Box */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: isPaidEvent ? '#eef2ff' : '#f0fdf4',
                border: `1px solid ${isPaidEvent ? '#c7d2fe' : '#bbf7d0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong>Event Fee:</strong> {isPaidEvent ? `₹${eventFee} (Payment Required)` : 'Free (No Payment Required)'}
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  {isPaidEvent
                    ? 'You will be redirected to the demo payment simulation step.'
                    : 'Your seat will be confirmed immediately without payment.'}
                </div>
              </div>
              <span className={`badge ${isPaidEvent ? 'badge-ongoing' : 'badge-attended'}`} style={{ fontSize: '0.85rem' }}>
                {isPaidEvent ? `₹${eventFee}` : 'Free'}
              </span>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', paddingBottom: 0 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                <span>Back to Edit</span>
              </button>

              {isPaidEvent ? (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <span>Proceed to Payment (₹{eventFee})</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmFreeRegistration}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 size={16} />
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm Registration'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: DEMO PAYMENT SIMULATION (ONLY FOR PAID EVENTS) */}
        {step === 3 && (
          <div className="demo-payment-section">
            <div className="demo-payment-header card" style={{ background: '#f8fafc', padding: '1rem', marginBottom: '1.25rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{event.eventName}</h4>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Simulated College Payment Gateway
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Amount Due</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4338ca' }}>
                    ₹{eventFee}
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-disclaimer-pill" style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', color: '#92400e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} />
              <span>
                <strong>Demo Mode:</strong> This is a safe simulated college payment flow. No real credit card or bank details are charged or saved.
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="payment-tabs-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${paymentMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPaymentMethod('UPI')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Smartphone size={16} />
                <span>UPI</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${paymentMethod === 'CARD' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPaymentMethod('CARD')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CreditCard size={16} />
                <span>Card</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${paymentMethod === 'NETBANKING' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPaymentMethod('NETBANKING')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Landmark size={16} />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Method 1: UPI */}
            {paymentMethod === 'UPI' && (
              <div className="payment-method-body card" style={{ padding: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Virtual Payment Address / UPI ID</label>
                  <div className="input-with-icon">
                    <Smartphone size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. yourname@oksbi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span className="text-muted" style={{ fontSize: '0.8rem', alignSelf: 'center' }}>Quick handles:</span>
                  {['@okaxis', '@oksbi', '@okhdfcbank', '@paytm', '@ybl'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setUpiId(prev => `${(prev || 'student').split('@')[0]}${h}`)}
                      className="badge"
                      style={{ cursor: 'pointer', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155' }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Method 2: Card */}
            {paymentMethod === 'CARD' && (
              <div className="payment-method-body card" style={{ padding: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <div className="input-with-icon">
                    <CreditCard size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="16-digit Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      className="form-control"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name as printed on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Method 3: Net Banking */}
            {paymentMethod === 'NETBANKING' && (
              <div className="payment-method-body card" style={{ padding: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Your Bank</label>
                  <select
                    className="form-control"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    {BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '6px' }}>
                  You will be safely routed through the simulated college sandbox portal.
                </p>
              </div>
            )}

            {/* Processing and Status indicators */}
            {paymentProcessing && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#4338ca' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <strong>Processing simulated payment with gateway...</strong>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Verifying transaction security and generating reference</p>
              </div>
            )}

            {paymentSuccessNotice && (
              <div className="alert alert-success" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} />
                <span>Payment Successful! Finalizing event seat...</span>
              </div>
            )}

            <div className="modal-footer" style={{ marginTop: '1.5rem', paddingBottom: 0 }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-secondary"
                disabled={paymentProcessing || paymentSuccessNotice}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleProcessPayment}
                className="btn btn-primary"
                disabled={paymentProcessing || paymentSuccessNotice}
              >
                <ShieldCheck size={16} />
                <span>{paymentProcessing ? 'Processing Payment...' : `Pay ₹${eventFee}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLEAN SUCCESS CONFIRMATION SECTION (FEATURE 9) */}
        {step === 4 && (
          <div className="registration-success-section" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle2 size={38} />
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Registration Successful!
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your participant details have been verified and your seat is successfully booked.
            </p>

            <div className="success-receipt-card card" style={{ textAlign: 'left', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-muted">Event:</span>
                <strong>{event.eventName}</strong>
              </div>

              <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-muted">Participant:</span>
                <span>{participant.fullName} ({participant.rollNumber})</span>
              </div>

              <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-muted">Date & Time:</span>
                <span>{event.eventDate} ({event.startTime})</span>
              </div>

              <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-muted">Venue:</span>
                <span>{event.venue}</span>
              </div>

              <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-muted">Payment:</span>
                <span className="badge" style={{ background: isPaidEvent ? '#dcfce7' : '#e0f2fe', color: isPaidEvent ? '#15803d' : '#0369a1', fontWeight: 600 }}>
                  {isPaidEvent ? `Paid (₹${eventFee})` : 'Not Required (Free)'}
                </span>
              </div>

              {registrationResult?.paymentReference && (
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span className="text-muted">Reference:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#4338ca' }}>
                    {registrationResult.paymentReference}
                  </strong>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/student/registrations');
                }}
                className="btn btn-primary"
              >
                View My Registrations
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/events');
                }}
                className="btn btn-secondary"
              >
                Back to Events
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RegistrationFlowModal;
