package com.chess.tk.service;

import com.chess.tk.db.entities.*;
import com.chess.tk.db.repositories.StudentRepository;
import com.chess.tk.db.repositories.TeacherRepository;
import com.chess.tk.db.repositories.UserRepository;
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

    public AdminService(UserRepository userRepo, PasswordEncoder passwordEncoder, StudentRepository studentRepo, TeacherRepository teacherRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
    }

    @Transactional
    public ResponseEntity<String> addTeacher(User user, Teacher teacher) {
        teacher.setUser(setFieldsToUser(user, Role.ROLE_TEACHER));
        teacherRepo.save(teacher);
        return ResponseEntity.ok().body("Teacher added successfully");
    }

    @Transactional
    public ResponseEntity<String> addStudent(User user, Student student) {
        student.setUser(setFieldsToUser(user, Role.ROLE_STUDENT));
        studentRepo.save(student);
        return ResponseEntity.ok().body("Student added successfully");
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

    public ResponseEntity<String> attachStudentToTeacher(Long id, Long studentId) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + studentId + " not found"));

        if (student.getTeacherId() != null) {
            return ResponseEntity.badRequest().body("Student with id " + studentId + " is already attached to teacher");
        }

        student.setTeacherId(teacher.getId());
        studentRepo.save(student);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Student with email " + student.getUser().getEmail()
                        + " attached to teacher with email " + teacher.getUser().getEmail());
    }

    public ResponseEntity<String> detachStudentFromTeacher(Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + id + " not found"));

        student.setTeacherId(null);
        studentRepo.save(student);

        return ResponseEntity.ok().body("Student with id " + id + " detached from teacher");
    }

    public List<Student> getStudentsByTeacherId(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return studentRepo.findByTeacherId(teacher.getId());
    }

    public User getByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not found"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByEmail;
    }
}
