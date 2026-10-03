package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.*;
import com.campus.eventmanagement.entity.Student;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public StudentResponseDto registerStudent(StudentRegisterDto dto) {
        if (studentRepository.existsByEmail(dto.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + dto.getEmail() + " already exists");
        }

        Student student = new Student();
        student.setName(dto.getName().trim());
        student.setEmail(dto.getEmail().trim().toLowerCase());
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setPhoneNumber(dto.getPhoneNumber().trim());
        student.setCollegeName(dto.getCollegeName() != null ? dto.getCollegeName().trim() : null);
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setRole("STUDENT");

        Student saved = studentRepository.save(student);
        return mapToResponseDto(saved);
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return new LoginResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRole(),
                student.getDepartment(),
                student.getYear(),
                student.getPhoneNumber(),
                student.getCollegeName(),
                "Login successful"
        );
    }

    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToResponseDto(student);
    }

    public StudentResponseDto updateProfile(Long id, StudentProfileUpdateDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        student.setName(dto.getName().trim());
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getCollegeName() != null) {
            student.setCollegeName(dto.getCollegeName().trim());
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            if (dto.getPassword().trim().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters long");
            }
            student.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        Student updated = studentRepository.save(student);
        return mapToResponseDto(updated);
    }

    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .filter(s -> !"ADMIN".equalsIgnoreCase(s.getRole()))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public StudentResponseDto mapToResponseDto(Student student) {
        return new StudentResponseDto(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment(),
                student.getYear(),
                student.getPhoneNumber(),
                student.getRole(),
                student.getCollegeName()
        );
    }
}
