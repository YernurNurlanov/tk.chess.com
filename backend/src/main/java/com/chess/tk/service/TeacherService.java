package com.chess.tk.service;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.enums.TaskLevel;
import com.chess.tk.db.repository.*;
import com.chess.tk.dto.*;
import com.chess.tk.exception.StudentAlreadyInGroupException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;
    private final GroupRepository groupRepo;
    private final LessonRepository lessonRepo;
    private final TaskRepository taskRepo;
    private final CompletedTaskRepository completedTaskRepo;

    public TeacherService(TeacherRepository teacherRepo, StudentRepository studentRepo,
                          GroupRepository groupRepo, LessonRepository lessonRepo,
                          TaskRepository taskRepo, CompletedTaskRepository completedTaskRepo) {
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
        this.groupRepo = groupRepo;
        this.lessonRepo = lessonRepo;
        this.taskRepo = taskRepo;
        this.completedTaskRepo = completedTaskRepo;
    }

    @Transactional
    public StudentBaseDTO addStudentToGroup(Long groupId, Long studentId) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        if (group.getStudentIds().contains(studentId)) {
            throw new StudentAlreadyInGroupException(studentId);
        }
        group.getStudentIds().add(student.getId());
        groupRepo.save(group);

        List<CompletedTask> performance = completedTaskRepo.findByStudentId(student.getId());

        return new StudentBaseDTO(
                student.getId(),
                student.getUser().getFirstName(),
                student.getUser().getLastName(),
                performance
        );
    }

    @Transactional
    public ResponseEntity<String> deleteStudentFromGroup(Long groupId, Long studentId) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        Long studentIdToRemove = group.getStudentIds().stream().filter(id -> id.equals(studentId)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found in group"));

        group.getStudentIds().remove(studentIdToRemove);
        groupRepo.save(group);

        return ResponseEntity.ok().body("Student with id " + studentId + " deleted from group " + groupId);
    }

    @Transactional
    public List<GroupBaseDTO> getAllGroupsByTeacher(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return groupRepo.findByTeacherId(teacher.getId())
                .stream()
                .map(GroupBaseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupStudentInfoDTO getGroupById(Long groupId) { // надо протестировать
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        List<StudentBaseDTO> studentInfos = group.getStudentIds().stream()
                .map(studentId -> {
                    Student student = studentRepo.findById(studentId)
                            .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

                    List<CompletedTask> performance = completedTaskRepo.findByStudentId(student.getId());

                    return new StudentBaseDTO(
                            student.getId(),
                            student.getUser().getFirstName(),
                            student.getUser().getLastName(),
                            performance
                            );
                })
                .toList();

        return new GroupStudentInfoDTO(
                group.getId(),
                group.getGroupName(),
                studentInfos
        );
    }

    public Group addGroup(Group group) {
        Teacher teacher = teacherRepo.findById(group.getTeacherId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + group.getTeacherId() + " not found"));

        List<Student> foundStudents = studentRepo.findAllById(group.getStudentIds());
        if (foundStudents.size() != group.getStudentIds().size()) {
            throw new EntityNotFoundException("Some students were not found");
        }

        List<Long> invalidStudents = foundStudents.stream()
                .filter(student -> student.getTeacherId() == null || !student.getTeacherId().equals(teacher.getId()))
                .map(Student::getId)
                .toList();

        if (!invalidStudents.isEmpty()) {
            throw new IllegalArgumentException("Students " + invalidStudents + " do not belong to teacher " + group.getTeacherId());
        }

        List<Long> uniqueStudents = new ArrayList<>(new HashSet<>(group.getStudentIds()));

        group.setStudentIds(uniqueStudents);
        return groupRepo.save(group);
    }

    public GroupBaseDTO updateGroup(Long groupId, String groupName) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        group.setGroupName(groupName);
        groupRepo.save(group);

        return new GroupBaseDTO(group);
    }

    public ResponseEntity<String> deleteGroup(Long id) {
        Group group = groupRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + id + " not found"));
        groupRepo.delete(group);

        return ResponseEntity.status(HttpStatus.OK).body("Group with ID " + id + " was deleted");
    }

    public List<DayLessonsDTO> getAllLessonsByTeacher(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return lessonRepo.findByTeacherId(teacher.getId())
                .stream()
                .map(AllLessonsDTO::new)
                .collect(Collectors.groupingBy(
                        dto -> dto.getStartTime().toLocalDate()
                ))
                .entrySet()
                .stream()
                .map(entry -> new DayLessonsDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(DayLessonsDTO::getDate))
                .toList();
    }

    @Transactional
    public LessonDTO getLessonById(Long id) {
        Lesson lesson = lessonRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + id + " not found"));

        Group group = groupRepo.findById(lesson.getGroupId())
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + id + " not found"));

        List<Task> tasks = taskRepo.findAllById(lesson.getTaskIds());

        List<Long> studentIds = group.getStudentIds();

        List<StudentLessonInfoDTO> studentInfos = studentIds.stream()
                .map(studentId -> {
                    Student student = studentRepo.findById(studentId)
                            .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

                    List<CompletedTask> completedTasks = completedTaskRepo
                            .findByStudentIdAndTaskIdIn(studentId, lesson.getTaskIds());

                    boolean attended = lesson.getPresentStudentIds().contains(studentId);

                    return new StudentLessonInfoDTO(
                            student.getId(),
                            student.getUser().getFirstName(),
                            student.getUser().getLastName(),
                            attended,
                            completedTasks
                    );
                })
                .toList();

        LessonDTO lessonDTO = new LessonDTO();
        lessonDTO.setId(lesson.getId());
        lessonDTO.setGroupName(group.getGroupName());
        lessonDTO.setStartTime(lesson.getStartTime());
        lessonDTO.setEndTime(lesson.getEndTime());
        lessonDTO.setTasks(tasks);
        lessonDTO.setStudentInfoDTOs(studentInfos);

        return lessonDTO;
    }

    public AllLessonsDTO addLesson(Lesson lesson) {
        Group group = groupRepo.findById(lesson.getGroupId())
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + lesson.getGroupId() + " not found"));

        List<Lesson> overlapping = lessonRepo.findOverlappingLessonsByTeacher(
                lesson.getTeacherId(),
                lesson.getStartTime(),
                lesson.getEndTime()
        );
        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("Lesson time overlaps with another lesson of this teacher.");
        }

        List<Task> tasks = taskRepo.findAllById(lesson.getTaskIds());
        if (tasks.size() != lesson.getTaskIds().size()) {
            throw new EntityNotFoundException("Some tasks were not found");
        }

        lesson.setTaskIds(new ArrayList<>(new HashSet<>(lesson.getTaskIds())));
        lesson.setGroup(group);
        lesson.setTeacherId(group.getTeacherId());
        return new AllLessonsDTO(lessonRepo.save(lesson));
    }

    public ResponseEntity<String> deleteLesson(Long id) {
        Lesson lesson = lessonRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + id + " not found"));
        lessonRepo.delete(lesson);

        return ResponseEntity.ok().body("Lesson with ID " + id + " was deleted");
    }

    @Transactional
    public LessonDTO updateLesson(Long lessonId, LocalDateTime startTime, LocalDateTime endTime, Long groupId) {
        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + lessonId + " not found"));

        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        lesson.setStartTime(startTime);
        lesson.setEndTime(endTime);
        lesson.setGroupId(group.getId());

        return getLessonById(lessonRepo.save(lesson).getId());
    }

    @Transactional
    public LessonDTO addTasksToLesson(Long lessonId, List<Long> taskIds) {
        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + lessonId + " not found"));

        taskIds = new ArrayList<>(new HashSet<>(taskIds));

        List<Long> existingTaskIds = lesson.getTaskIds();

        List<Long> newTaskIds = taskIds.stream()
                .filter(id -> !existingTaskIds.contains(id))
                .toList();

        if (newTaskIds.isEmpty()) {
            throw new IllegalArgumentException("All provided tasks are already added to the lesson");
        }

        List<Task> tasks = taskRepo.findAllById(newTaskIds);
        if (tasks.size() != newTaskIds.size()) {
            throw new EntityNotFoundException("Some tasks were not found");
        }

        existingTaskIds.addAll(newTaskIds);
        lesson.setTaskIds(new ArrayList<>(new HashSet<>(existingTaskIds)));

        lessonRepo.save(lesson);
        return getLessonById(lesson.getId());
    }


    @Transactional
    public MarkAttendanceRequest markAttendance(Long lessonId, List<Long> presentStudentIds) {
        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + lessonId + " not found"));

        if (!new HashSet<>(lesson.getGroup().getStudentIds()).containsAll(presentStudentIds)) {
            throw new IllegalArgumentException("Some students are not part of this group.");
        }

        lesson.setPresentStudentIds(presentStudentIds);
        return new MarkAttendanceRequest(lessonRepo.save(lesson));
    }

    public List<LevelTasksDTO> getTasksWithoutEndFin() {
        List<Task> tasks = taskRepo.findTasksWithEmptyEndFin();

        return tasks.stream()
                .collect(Collectors.groupingBy(Task::getLevel))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    TaskLevel level = entry.getKey();
                    List<Task> levelTasks = entry.getValue();

                    List<TopicTasksDTO> topics = levelTasks.stream()
                            .collect(Collectors.groupingBy(Task::getTopic))
                            .entrySet()
                            .stream()
                            .sorted(Map.Entry.comparingByKey())
                            .map(e -> new TopicTasksDTO(e.getKey(), e.getValue()))
                            .toList();

                    return new LevelTasksDTO(level, topics);
                })
                .toList();
    }
}
