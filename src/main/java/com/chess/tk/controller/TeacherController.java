package com.chess.tk.controller;

import com.chess.tk.db.entities.Student;
import com.chess.tk.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/")
    public ResponseEntity<String> addGroup(@RequestBody Long id,@RequestBody List<String> students) {
        return teacherService.addGroup(id, students);
    }

    @GetMapping("/{id}")
    public List<Student> getStudentsByTeacherId(@PathVariable Long id) {
        return teacherService.getStudentsByTeacherId(id);
    }
}
