package com.chess.tk.controller;

import com.chess.tk.db.entities.Group;
import com.chess.tk.db.entities.Lesson;
import com.chess.tk.db.entities.Student;
import com.chess.tk.dto.AllLessonsDTO;
import com.chess.tk.dto.StudentInGroupRequest;
import com.chess.tk.service.TeacherService;
import jakarta.validation.Valid;
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

    @GetMapping("/{id}/students")
    public List<Student> getStudentsByTeacherId(@PathVariable Long id) {
        return teacherService.getStudentsByTeacherId(id);
    }

    @GetMapping("/{id}/groups")
    public List<Group> getAllGroupsByTeacher(@PathVariable Long id) {
        return teacherService.getAllGroupsByTeacher(id);
    }

    @GetMapping("/{id}/lessons")
    public List<AllLessonsDTO> getAllLessonsByTeacher(@PathVariable Long id) {
        return teacherService.getAllLessonsByTeacher(id);
    }

//    @GetMapping("/lesson/{id}")
//    public Lesson getLessonById(@PathVariable Long id) {
//        return teacherService.getLesson(id);
//    }

    @PostMapping("/")
    public ResponseEntity<String> addGroup(@Valid @RequestBody Group group) {
        return teacherService.addGroup(group);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long id) {
        return teacherService.deleteGroup(id);
    }

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudentToGroup(@RequestBody StudentInGroupRequest request) {
        return teacherService.addStudentToGroup(request.getGroupId(), request.getStudentId());
    }

    @DeleteMapping("/deleteStudent")
    public ResponseEntity<String> deleteStudentFromGroup(@RequestBody StudentInGroupRequest request) {
        return teacherService.deleteStudentFromGroup(request.getGroupId(), request.getStudentId());
    }

    @PostMapping("/lesson")
    public ResponseEntity<String> addLesson(@Valid @RequestBody Lesson lesson) {
        return teacherService.addLesson(lesson);
    }

    @DeleteMapping("lesson/{id}")
    public ResponseEntity<String> deleteLesson(@PathVariable Long id) {
        return teacherService.deleteLesson(id);
    }
}
