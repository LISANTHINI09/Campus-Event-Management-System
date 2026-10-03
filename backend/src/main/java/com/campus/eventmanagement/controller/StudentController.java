package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.*;
import com.campus.eventmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<StudentResponseDto> register(@Valid @RequestBody StudentRegisterDto dto) {
        StudentResponseDto response = studentService.registerStudent(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = studentService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateProfile(@PathVariable Long id,
                                                            @Valid @RequestBody StudentProfileUpdateDto dto) {
        return ResponseEntity.ok(studentService.updateProfile(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
}
