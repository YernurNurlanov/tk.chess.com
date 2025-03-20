package com.chess.tk.controller;

import com.chess.tk.db.entities.*;
import com.chess.tk.db.repositories.StudentRepository;
import com.chess.tk.db.repositories.TeacherRepository;
import com.chess.tk.dto.AddStudentRequest;
import com.chess.tk.dto.AddTeacherRequest;
import com.chess.tk.dto.AttachStudentRequest;
import com.chess.tk.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;

    public AdminController(AdminService adminService, TeacherRepository teacherRepo, StudentRepository studentRepo) {
        this.adminService = adminService;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/addTeacher")
    public ResponseEntity<String> addTeacher(@RequestBody AddTeacherRequest request) {
        User user = request.getUser();
        Teacher teacher = request.getTeacher();
        return adminService.addTeacher(user, teacher);
    }

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudent(@RequestBody AddStudentRequest request) {
        User user = request.getUser();
        Student student = request.getStudent();
        return adminService.addStudent(user, student);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }

    @PutMapping("/")
    public ResponseEntity<String> updateUser(@RequestBody @Valid User user) {
        return adminService.updateUser(user);
    }

    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    @PostMapping("/attach")
    public ResponseEntity<String> addStudents(@RequestBody AttachStudentRequest request) {
        return adminService.attachStudentToTeacher(request);
    }

    @GetMapping("/{id}")
    public List<Student> getStudentsByTeacherId(@PathVariable Long id) {
        return adminService.getStudentsByTeacherId(id);
    }
}
