package com.campus.eventmanagement.config;

import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.Student;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import com.campus.eventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public DataInitializer(StudentRepository studentRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository) {
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() == 0) {
            seedStudents();
        }

        if (eventRepository.count() == 0) {
            seedEvents();
        }

        if (registrationRepository.count() == 0) {
            seedRegistrations();
        }
    }

    private void seedStudents() {
        // Admin
        Student admin = new Student(
                "Campus Event Admin",
                "admin@campus.edu",
                "Administration",
                "Faculty",
                "9876543210",
                passwordEncoder.encode("Admin@123"),
                "ADMIN"
        );
        studentRepository.save(admin);

        // 8 Sample Students
        List<Student> students = List.of(
                new Student("Rahul Sharma", "rahul.sharma@campus.edu", "CSE", "3rd Year", "9845123456", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Priya Patel", "priya.patel@campus.edu", "IT", "2nd Year", "9845234567", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Amit Kumar", "amit.kumar@campus.edu", "ECE", "4th Year", "9845345678", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Sneha Reddy", "sneha.reddy@campus.edu", "AI & DS", "2nd Year", "9845456789", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Vikram Singh", "vikram.singh@campus.edu", "MECH", "3rd Year", "9845567890", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Ananya Iyer", "ananya.iyer@campus.edu", "EEE", "1st Year", "9845678901", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Karthik Raja", "karthik.raja@campus.edu", "CIVIL", "4th Year", "9845789012", passwordEncoder.encode("Student@123"), "STUDENT"),
                new Student("Pooja Verma", "pooja.verma@campus.edu", "CSE", "2nd Year", "9845890123", passwordEncoder.encode("Student@123"), "STUDENT")
        );
        studentRepository.saveAll(students);
    }

    private void seedEvents() {
        LocalDate today = LocalDate.now();

        List<Event> events = new ArrayList<>();

        events.add(new Event(
                "Java Full Stack Workshop",
                "Comprehensive hands-on workshop covering Spring Boot, RESTful APIs, React.js integration, JPA, and MySQL database best practices for building enterprise-grade web applications.",
                "Workshop",
                today.plusDays(7),
                "09:30 AM",
                "04:30 PM",
                "Turing Auditorium, Block A",
                "Computer Science Department",
                60,
                today.plusDays(5)
        ));

        events.add(new Event(
                "AI & ML Seminar",
                "Keynote address by industry experts on Generative AI, Large Language Models, Computer Vision, and real-world deployment of machine learning models in modern industry.",
                "Seminar",
                today.plusDays(10),
                "10:00 AM",
                "01:00 PM",
                "Main College Seminar Hall",
                "AI & DS Department",
                120,
                today.plusDays(8)
        ));

        events.add(new Event(
                "Annual Sports Meet 2026",
                "The biggest inter-departmental athletic extravaganza featuring track and field events, football, basketball, cricket, badminton, and relay championships.",
                "Sports",
                today.plusDays(15),
                "08:00 AM",
                "05:00 PM",
                "University Sports Complex & Grounds",
                "Physical Education Council",
                200,
                today.plusDays(12)
        ));

        events.add(new Event(
                "Hackathon 2026",
                "24-hour non-stop campus hackathon to ideate, build, and pitch innovative software and hardware prototypes for real-world sustainable solutions. Great prizes and mentorship!",
                "Hackathon",
                today.plusDays(18),
                "09:00 AM",
                "09:00 AM",
                "Innovation & Incubation Hub",
                "Coding Club & Developer Student Club",
                80,
                today.plusDays(14)
        ));

        events.add(new Event(
                "Web Development Bootcamp",
                "Zero to hero intensive crash course on modern frontend engineering: HTML5, CSS3, modern JavaScript ES6+, React Hooks, and state management techniques.",
                "Workshop",
                today.plusDays(4),
                "02:00 PM",
                "05:30 PM",
                "Software Lab 3, IT Block",
                "Information Technology Club",
                45,
                today.plusDays(2)
        ));

        events.add(new Event(
                "Tarang - Annual Cultural Fest",
                "A vibrant three-day cultural celebration including musical concerts, dance battles, battle of bands, theatrical drama, fashion shows, and art exhibitions.",
                "Cultural",
                today.plusDays(25),
                "04:00 PM",
                "10:00 PM",
                "Open Air Amphitheatre",
                "Student Cultural Committee",
                300,
                today.plusDays(20)
        ));

        events.add(new Event(
                "Cyber Security & Ethical Hacking Program",
                "Learn essential principles of network security, ethical hacking methodologies, vulnerability assessment, penetration testing, and digital forensics with live demonstrations.",
                "Technical",
                today.plusDays(12),
                "11:00 AM",
                "03:00 PM",
                "Auditorium 2, Tech Park",
                "Cyber Security Club",
                75,
                today.plusDays(9)
        ));

        events.add(new Event(
                "Cloud Computing with AWS & Azure",
                "Discover cloud architecture, virtualization, containerization with Docker and Kubernetes, and serverless computing models with practical cloud lab exercises.",
                "Workshop",
                today.plusDays(21),
                "10:00 AM",
                "02:00 PM",
                "Cloud Computing Lab, Block C",
                "Cloud Engineering Forum",
                50,
                today.plusDays(17)
        ));

        events.add(new Event(
                "IoT & Robotics Innovation Expo",
                "Student teams demonstrate smart home gadgets, automated rover designs, drone tech, and sensor networks connected to microcontroller platforms like ESP32 and Arduino.",
                "Club Activity",
                today.plusDays(14),
                "10:30 AM",
                "04:00 PM",
                "Exhibition Hall, Mechanical Block",
                "Robotics & Automation Society",
                90,
                today.plusDays(11)
        ));

        events.add(new Event(
                "Campus Placement & Interview Prep Seminar",
                "Exclusive session by top recruitment leads covering resume building, technical coding interview strategies, HR rounds, system design viva tips, and mock interviews.",
                "Seminar",
                today.plusDays(8),
                "03:00 PM",
                "06:00 PM",
                "Placement Training Auditorium",
                "Career & Placement Cell",
                150,
                today.plusDays(6)
        ));

        eventRepository.saveAll(events);
    }

    private void seedRegistrations() {
        List<Student> students = studentRepository.findAll();
        List<Event> events = eventRepository.findAll();

        if (students.size() > 1 && !events.isEmpty()) {
            Student rahul = students.stream().filter(s -> "rahul.sharma@campus.edu".equals(s.getEmail())).findFirst().orElse(null);
            Student priya = students.stream().filter(s -> "priya.patel@campus.edu".equals(s.getEmail())).findFirst().orElse(null);
            Student sneha = students.stream().filter(s -> "sneha.reddy@campus.edu".equals(s.getEmail())).findFirst().orElse(null);

            Event javaWorkshop = events.stream().filter(e -> e.getEventName().contains("Java Full Stack")).findFirst().orElse(null);
            Event aiSeminar = events.stream().filter(e -> e.getEventName().contains("AI & ML")).findFirst().orElse(null);
            Event hackathon = events.stream().filter(e -> e.getEventName().contains("Hackathon")).findFirst().orElse(null);
            Event sportsMeet = events.stream().filter(e -> e.getEventName().contains("Sports Meet")).findFirst().orElse(null);

            if (rahul != null && javaWorkshop != null) {
                registrationRepository.save(new Registration(rahul, javaWorkshop, LocalDateTime.now().minusDays(2), "REGISTERED"));
                javaWorkshop.setCurrentRegisteredCount(javaWorkshop.getCurrentRegisteredCount() + 1);
                eventRepository.save(javaWorkshop);
            }

            if (rahul != null && hackathon != null) {
                registrationRepository.save(new Registration(rahul, hackathon, LocalDateTime.now().minusDays(1), "REGISTERED"));
                hackathon.setCurrentRegisteredCount(hackathon.getCurrentRegisteredCount() + 1);
                eventRepository.save(hackathon);
            }

            if (priya != null && javaWorkshop != null) {
                registrationRepository.save(new Registration(priya, javaWorkshop, LocalDateTime.now().minusDays(1), "REGISTERED"));
                javaWorkshop.setCurrentRegisteredCount(javaWorkshop.getCurrentRegisteredCount() + 1);
                eventRepository.save(javaWorkshop);
            }

            if (priya != null && aiSeminar != null) {
                registrationRepository.save(new Registration(priya, aiSeminar, LocalDateTime.now().minusDays(2), "REGISTERED"));
                aiSeminar.setCurrentRegisteredCount(aiSeminar.getCurrentRegisteredCount() + 1);
                eventRepository.save(aiSeminar);
            }

            if (sneha != null && aiSeminar != null) {
                registrationRepository.save(new Registration(sneha, aiSeminar, LocalDateTime.now().minusHours(5), "REGISTERED"));
                aiSeminar.setCurrentRegisteredCount(aiSeminar.getCurrentRegisteredCount() + 1);
                eventRepository.save(aiSeminar);
            }

            if (sneha != null && sportsMeet != null) {
                registrationRepository.save(new Registration(sneha, sportsMeet, LocalDateTime.now().minusHours(3), "REGISTERED"));
                sportsMeet.setCurrentRegisteredCount(sportsMeet.getCurrentRegisteredCount() + 1);
                eventRepository.save(sportsMeet);
            }
        }
    }
}
