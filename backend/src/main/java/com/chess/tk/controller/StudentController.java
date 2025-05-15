package com.chess.tk.controller;

import com.chess.tk.db.entity.CompletedTask;
import com.chess.tk.dto.AllLessonsDTO;
import com.chess.tk.dto.TaskWithCompletionDTO;
import com.chess.tk.service.StudentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('STUDENT')")
@RequestMapping("/student")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/{id}/lessons")
    public List<AllLessonsDTO> getAllLessons(@PathVariable Long id) {
        return studentService.getAllLessons(id);
    }

    @GetMapping("/tasks")
    public List<TaskWithCompletionDTO> getAllTasks(@RequestParam Long studentId, @RequestParam Long lessonId) {
        return studentService.getTasksByLesson(studentId, lessonId);
    }

    @PatchMapping("/{id}/check")
    public CompletedTask checkTask(@RequestBody TaskWithCompletionDTO task, @PathVariable Long id) {
        return studentService.checkTask(task, id);
    }
}
