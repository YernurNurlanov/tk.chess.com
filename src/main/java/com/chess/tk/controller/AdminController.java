package com.chess.tk.controller;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.repository.StudentRepository;
import com.chess.tk.db.repository.TeacherRepository;
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

    @PostMapping("/teachers")
    public Teacher addTeacher(@Valid @RequestBody AddTeacherRequest request) {
        return adminService.addTeacher(request.getUser(), request.getTeacher());
    }

    @PostMapping("/students")
    public Student addStudent(@Valid @RequestBody AddStudentRequest request) {
        return adminService.addStudent(request.getUser(), request.getStudent());
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

    @PutMapping("/attach")
    public Student attachStudentToTeacher(@Valid @RequestBody AttachStudentRequest request) {
        return adminService.attachStudentToTeacher(request.getId(), request.getStudentId());
    }

    @PutMapping("/detach/{id}")
    public Student detachStudentFromTeacher(@PathVariable Long id) {
        return adminService.detachStudentFromTeacher(id);
    }

    @PostMapping("/tasks")
    public Task addTask(@Valid @RequestBody Task task) {
        return adminService.addTask(task);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        return adminService.deleteTask(id);
    }
}
