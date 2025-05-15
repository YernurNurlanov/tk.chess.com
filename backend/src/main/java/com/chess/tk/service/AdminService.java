package com.chess.tk.service;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.enums.Role;
import com.chess.tk.db.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepo;
    private final TeacherRepository teacherRepo;
    private final GroupRepository groupRepo;
    private final TaskRepository taskRepo;

    public AdminService(UserRepository userRepo, PasswordEncoder passwordEncoder, StudentRepository studentRepo,
                        TeacherRepository teacherRepo, GroupRepository groupRepo, TaskRepository taskRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
        this.groupRepo = groupRepo;
        this.taskRepo = taskRepo;
    }

    @Transactional
    public Teacher addTeacher(User user, Teacher teacher) {
        teacher.setUser(setFieldsToUser(user, Role.ROLE_TEACHER));
        return teacherRepo.save(teacher);
    }

    @Transactional
    public Student addStudent(User user, Student student) {
        student.setUser(setFieldsToUser(user, Role.ROLE_STUDENT));
        return studentRepo.save(student);
    }

    private User setFieldsToUser(User user, Role role) {
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        return userRepo.save(user);
    }

    @Transactional
    public ResponseEntity<String> deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));

        if (user.getRole() == Role.ROLE_TEACHER) {
            studentRepo.findByTeacherId(user.getId()).forEach(student -> {
                student.setTeacherId(null);
                studentRepo.save(student);
            });
        }

        userRepo.delete(user);
        return ResponseEntity.status(HttpStatus.OK).body("User with ID " + id + " was deleted");
    }

    public ResponseEntity<String> updateUser(User user) { // TODO переделать метод
//        Optional<User> userOptional = userRepo.findById(user.getId());
//        if (userOptional.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + user.getId() + " not found");
//        }
//        User userToUpdate = userOptional.get();
//        userToUpdate.setFullName(user.getFullName());
//        userToUpdate.setEmail(user.getEmail());
//        userToUpdate.setPhone(user.getPhone());
//        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
//        userToUpdate.setLastPayment(user.getLastPayment());
//        userToUpdate.setHourlyRate(user.getHourlyRate());
//        userToUpdate.setRole(user.getRole());
//        userRepo.save(userToUpdate);
        return ResponseEntity.ok("User with id " + user.getId() + " updated successfully");
    }

    public Student attachStudentToTeacher(Long id, Long studentId) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        if (student.getTeacherId() != null) {
            throw new IllegalArgumentException("Student with id " + studentId + " is already attached to teacher");
        }

        student.setTeacherId(teacher.getId());
        return studentRepo.save(student);
    }

    @Transactional
    public Student detachStudentFromTeacher(Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + id + " not found"));

        if (student.getTeacherId() != null) {
            Teacher teacher = teacherRepo.findById(student.getTeacherId())
                    .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + student.getTeacherId() + " not found"));

            List<Group> teacherGroups = teacher.getGroups();

            for (Group group : teacherGroups) {
                List<Long> studentIds = group.getStudentIds();
                if (studentIds.remove(id)) {
                    groupRepo.save(group);
                }
            }
        }
        student.setTeacherId(null);
        return studentRepo.save(student);
    }

    public Task addTask(Task task) {
        if (taskRepo.findByStartFinAndEndFin(task.getStartFin(), task.getEndFin()) != null) {
            throw new IllegalArgumentException("Task with this position already exists");
        }

        return taskRepo.save(task);
    }

    public ResponseEntity<String> deleteTask(Long id) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with id " + id + " not found"));

        taskRepo.delete(task);
        return ResponseEntity.ok().body("Task with id " + id + " deleted successfully");
    }

    public User getByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not found"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByEmail;
    }
}
