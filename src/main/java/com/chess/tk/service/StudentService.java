package com.chess.tk.service;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.repository.*;
import com.chess.tk.dto.AllLessonsDTO;
import com.chess.tk.dto.TaskWithCompletionDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository studentRepo;
    private final LessonRepository lessonRepo;
    private final GroupRepository groupRepo;
    private final TaskRepository taskRepo;
    private final CompletedTaskRepository completedTaskRepo;

    public StudentService(StudentRepository studentRepo, LessonRepository lessonRepo, GroupRepository groupRepo, TaskRepository taskRepo, CompletedTaskRepository completedTaskRepo) {
        this.studentRepo = studentRepo;
        this.lessonRepo = lessonRepo;
        this.groupRepo = groupRepo;
        this.taskRepo = taskRepo;
        this.completedTaskRepo = completedTaskRepo;
    }

    @Transactional
    public List<AllLessonsDTO> getAllLessons(Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + id + " not found"));

        List<Group> groups = groupRepo.findByStudentId(student.getId());

        List<Lesson> lessons = groups.stream()
                .flatMap(group -> group.getLessons().stream())
                .toList();

        return lessons.stream()
                .map(AllLessonsDTO::new)
                .toList();
    }

    @Transactional
    public List<TaskWithCompletionDTO> getTasksByLesson(Long studentId, Long lessonId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + lessonId + " not found"));

        List<Task> tasks = taskRepo.findAllById(lesson.getTaskIds());

        List<CompletedTask> completedTasks = completedTaskRepo.findByStudentIdAndTaskIdIn(student.getId(), lesson.getTaskIds());
        Map<Long, CompletedTask> completedTaskMap = completedTasks.stream()
                .collect(Collectors.toMap(CompletedTask::getTaskId, ct -> ct));

        return tasks.stream()
                .map(task -> {
                    CompletedTask completedTask = completedTaskMap.get(task.getId());
                    if (completedTask != null && completedTask.getTaskId().equals(task.getId())) {
                        return new TaskWithCompletionDTO(task, completedTask);
                    } else {
                        return new TaskWithCompletionDTO(task, null);
                    }
                })
                .toList();
    }

    public CompletedTask checkTask(TaskWithCompletionDTO taskForCheck, Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        Task task = taskRepo.findById(taskForCheck.getTaskId())
                .orElseThrow(() -> new EntityNotFoundException("Task with id " + taskForCheck.getTaskId() + " not found"));

        CompletedTask completedTask;

        if (taskForCheck.getAttemptNumber() == 0) {
            completedTask = new CompletedTask();
            completedTask.setStudentId(student.getId());
            completedTask.setTaskId(task.getId());
            completedTask.setAttemptNumber(1);
        } else {
            completedTask = completedTaskRepo.findByStudentIdAndTaskId(student.getId(), task.getId());

            if (completedTask.isCompleted()) {
                return completedTask;
            }

            completedTask.setAttemptNumber(completedTask.getAttemptNumber() + 1);
        }

        completedTask.setCompleted(taskForCheck.isCompleted());
        completedTask.setCompletedAt(taskForCheck.isCompleted() ? LocalDateTime.now() : null);

        return completedTaskRepo.save(completedTask);
    }
}
