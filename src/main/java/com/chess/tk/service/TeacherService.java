package com.chess.tk.service;

import com.chess.tk.db.entities.Group;
import com.chess.tk.db.entities.Lesson;
import com.chess.tk.db.entities.Student;
import com.chess.tk.db.entities.Teacher;
import com.chess.tk.db.repositories.GroupRepository;
import com.chess.tk.db.repositories.LessonRepository;
import com.chess.tk.db.repositories.StudentRepository;
import com.chess.tk.db.repositories.TeacherRepository;
import com.chess.tk.dto.AllLessonsDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;
    private final GroupRepository groupRepo;
    private final LessonRepository lessonRepo;

    public TeacherService(TeacherRepository teacherRepo, StudentRepository studentRepo, GroupRepository groupRepo, LessonRepository lessonRepo) {
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
        this.groupRepo = groupRepo;
        this.lessonRepo = lessonRepo;
    }

    public ResponseEntity<String> addGroup(Group group) {
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
        groupRepo.save(group);
        return ResponseEntity.ok().body("Group added successfully");
    }

    public ResponseEntity<String> deleteGroup(Long id) {
        Group group = groupRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + id + " not found"));
        groupRepo.delete(group);

        return ResponseEntity.status(HttpStatus.OK).body("Group with ID " + id + " was deleted");
    }

    @Transactional
    public List<Group> getAllGroupsByTeacher(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return groupRepo.findByTeacherId(teacher.getId())
                .stream()
                .peek(group -> Hibernate.initialize(group.getStudentIds()))
                .collect(Collectors.toList());
    }

    public List<AllLessonsDTO> getAllLessonsByTeacher(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return lessonRepo.findByTeacherId(teacher.getId())
                .stream()
                .map(AllLessonsDTO::new)
//                .peek(lesson -> {
//                    Hibernate.initialize(lesson.getTaskIds());
//                    Hibernate.initialize(lesson.getGroup().getStudentIds());
//                })
                .toList();
    }

//    public Lesson getLesson(Long id) {
//        Lesson lesson = lessonRepo.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + id + " not found"));
//
//        return lesson;
//    }

    @Transactional
    public ResponseEntity<String> addStudentToGroup(Long groupId, Long studentId) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        if (group.getStudentIds().contains(studentId)) {
            return ResponseEntity.badRequest().body("Student with id " + studentId + " already exists in the group");
        }

        group.getStudentIds().add(student.getId());
        groupRepo.save(group);

        return ResponseEntity.ok().body("Student with id " + studentId + " added to group " + groupId);
    }

    @Transactional
    public ResponseEntity<String> deleteStudentFromGroup(Long groupId, Long studentId) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + groupId + " not found"));

        Long studentIdToRemove = group.getStudentIds().stream().filter(id -> id.equals(studentId)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found in group " + groupId));

        group.getStudentIds().remove(studentIdToRemove);
        groupRepo.save(group);

        return ResponseEntity.ok().body("Student with id " + studentId + " deleted from group " + groupId);
    }

    public ResponseEntity<String> addLesson(Lesson lesson) {
        Group group = groupRepo.findById(lesson.getGroupId())
                .orElseThrow(() -> new EntityNotFoundException("Group with id " + lesson.getGroupId() + " not found"));

        lesson.setGroup(group);
        lesson.setTeacherId(group.getTeacherId());
        lessonRepo.save(lesson);

        return ResponseEntity.ok().body("Lesson added successfully");
    }

    public ResponseEntity<String> deleteLesson(Long id) {
        Lesson lesson = lessonRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson with id " + id + " not found"));
        lessonRepo.delete(lesson);

        return ResponseEntity.ok().body("Lesson with ID " + id + " was deleted");
    }

    public List<Student> getStudentsByTeacherId(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return studentRepo.findByTeacherId(teacher.getId());
    }
}
