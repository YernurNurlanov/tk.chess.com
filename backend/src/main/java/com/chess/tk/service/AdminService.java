package com.chess.tk.service;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.enums.Role;
import com.chess.tk.db.repository.*;
import com.chess.tk.dto.updateUser.StudentDTO;
import com.chess.tk.dto.updateUser.TeacherDTO;
import com.chess.tk.dto.updateUser.UserDTO;
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
    private final EmailService emailService;

    public AdminService(UserRepository userRepo, PasswordEncoder passwordEncoder, StudentRepository studentRepo,
                        TeacherRepository teacherRepo, GroupRepository groupRepo, TaskRepository taskRepo, EmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
        this.groupRepo = groupRepo;
        this.taskRepo = taskRepo;
        this.emailService = emailService;
    }

    @Transactional
    public Teacher addTeacher(User user, Teacher teacher) {
        String password = user.getPassword();
        teacher.setUser(setFieldsToUser(user, Role.ROLE_TEACHER));
        Teacher savedTeacher = teacherRepo.save(teacher);
        emailService.sendCredentialsEmail(user.getEmail(), password);
        return savedTeacher;
    }

    @Transactional
    public Student addStudent(User user, Student student) {
        String password = user.getPassword();
        student.setUser(setFieldsToUser(user, Role.ROLE_STUDENT));
        Student savedStudent = studentRepo.save(student);
        emailService.sendCredentialsEmail(user.getEmail(), password);
        return savedStudent;
    }

    private User setFieldsToUser(User user, Role role) {
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setPasswordTemporary(true);
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

    @Transactional
    public Student updateStudent(UserDTO updatedUser, StudentDTO updatedStudent) {
        Student student = studentRepo.findById(updatedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + updatedUser.getId() + " not found"));

        User user = userRepo.save(setFieldsToUpdatedUser(student.getUser(), updatedUser));

        student.setUser(user);
        student.setLastPayment(updatedStudent.getLastPayment());

        return studentRepo.save(student);
    }

    @Transactional
    public Teacher updateTeacher(UserDTO updatedUser, TeacherDTO updatedTeacher) {
        Teacher teacher = teacherRepo.findById(updatedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + updatedUser.getId() + " not found"));

        User user = userRepo.save(setFieldsToUpdatedUser(teacher.getUser(), updatedUser));

        teacher.setUser(user);
        teacher.setHourlyRate(updatedTeacher.getHourlyRate());
        teacher.setSchedule(updatedTeacher.getSchedule());
        teacher.setBio(updatedTeacher.getBio());
        teacher.setExperienceYears(updatedTeacher.getExperienceYears());
        teacher.setChessRating(updatedTeacher.getChessRating());
        return teacherRepo.save(teacher);
    }

    private User setFieldsToUpdatedUser(User user, UserDTO updatedUser) {
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        return user;
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
