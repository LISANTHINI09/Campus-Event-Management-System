import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading campus events...' }) => {
  return (
    <div className="loading-spinner-container">
      <Loader2 size={36} className="spinner-icon" />
      {message && <p className="loading-spinner-text">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
