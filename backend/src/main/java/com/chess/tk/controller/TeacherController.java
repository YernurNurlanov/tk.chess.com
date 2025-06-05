package com.chess.tk.controller;

import com.chess.tk.db.entity.Group;
import com.chess.tk.db.entity.Lesson;
import com.chess.tk.dto.*;
import com.chess.tk.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @PatchMapping("/students")
    public StudentBaseDTO addStudentToGroup(@RequestBody StudentInGroupRequest request) {
        return teacherService.addStudentToGroup(request.getGroupId(), request.getStudentId());
    }

    @DeleteMapping("/students")
    public ResponseEntity<String> deleteStudentFromGroup(@RequestBody StudentInGroupRequest request) {
        return teacherService.deleteStudentFromGroup(request.getGroupId(), request.getStudentId());
    }

    @GetMapping("/{id}/groups")
    public List<GroupBaseDTO> getAllGroupsByTeacher(@PathVariable Long id) {
        return teacherService.getAllGroupsByTeacher(id);
    }

    @GetMapping("/groups/{id}")
    public GroupStudentInfoDTO getGroupById(@PathVariable Long id) {
        return teacherService.getGroupById(id);
    }

    @PostMapping("/groups")
    public Group addGroup(@Valid @RequestBody Group group) {
        return teacherService.addGroup(group);
    }

    @PutMapping("/groups")
    public GroupBaseDTO updateGroup(@Valid @RequestBody GroupBaseDTO group) {
        return teacherService.updateGroup(group.getId(), group.getGroupName());
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long id) {
        return teacherService.deleteGroup(id);
    }

    @GetMapping("/{id}/lessons")
    public List<DayLessonsDTO> getAllLessonsByTeacher(@PathVariable Long id) {
        return teacherService.getAllLessonsByTeacher(id);
    }

    @GetMapping("/lessons/{id}")
    public LessonDTO getLessonById(@PathVariable Long id) {
        return teacherService.getLessonById(id);
    }

    @PostMapping("/lessons")
    public AllLessonsDTO addLesson(@Valid @RequestBody Lesson lesson) {
        return teacherService.addLesson(lesson);
    }

    @DeleteMapping("lessons/{id}")
    public ResponseEntity<String> deleteLesson(@PathVariable Long id) {
        return teacherService.deleteLesson(id);
    }

    @PutMapping("/lessons")
    public LessonDTO updateLesson(@Valid @RequestBody UpdateLessonRequest request) {
        return teacherService.updateLesson(request.getLessonId(), request.getStartTime(), request.getEndTime(), request.getGroupId());
    }

    @PostMapping("/tasks")
    public LessonDTO addTasksToLesson(@Valid @RequestBody AddTasksToLessonRequest request) {
        return teacherService.addTasksToLesson(request.getLessonId(), request.getTaskIds());
    }

    @PostMapping("/attendance")
    public MarkAttendanceRequest markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        return teacherService.markAttendance(request.getLessonId(), request.getStudentIds());
    }

    @GetMapping("/lessons/tasks")
    public List<LevelTasksDTO> getTasksWithoutEndFin() {
        return teacherService.getTasksWithoutEndFin();
    }

    @GetMapping("/tasks")
    public List<LevelTasksDTO> getTasksWithEndFin() {
        return teacherService.getTasksWithNonEmptyEndFin();
    }
}
