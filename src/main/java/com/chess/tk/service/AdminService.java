package com.chess.tk.service;

import com.chess.tk.db.entities.*;
import com.chess.tk.db.repositories.StudentRepository;
import com.chess.tk.db.repositories.TeacherRepository;
import com.chess.tk.db.repositories.UserRepository;
import com.chess.tk.dto.AttachStudentRequest;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        teacher.setUser(setFields(user));
        teacherRepo.save(teacher);
        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<String> addStudent(User user, Student student) {
        student.setUser(setFields(user));
        studentRepo.save(student);
        return ResponseEntity.ok().build();
    }

    private User setFields(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ROLE_TEACHER);
        return userRepo.save(user);
    }

    public ResponseEntity<String> deleteUser(Long id) {
        Optional<User> userOptional = userRepo.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found");
        }
        if (userOptional.get().getRole().equals(Role.ROLE_TEACHER)) {
            teacherRepo.deleteById(id);
        }
        studentRepo.deleteById(id);
        userRepo.delete(userOptional.get());
        return ResponseEntity.status(HttpStatus.OK).body("User with ID " + id + " was deleted");
    }
    public ResponseEntity<String> updateUser(User user) {
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
        return ResponseEntity.ok("User updated successfully");
    }

    public ResponseEntity<String> attachStudentToTeacher(AttachStudentRequest request) {
        if (!teacherRepo.existsById(request.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Teacher with this id is not exists");
        }
        Optional<Student> optionalStudent = studentRepo.findById(request.getStudentId());
        Student student;
        if (optionalStudent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Student with this id is not exists");
        } else {
            student = optionalStudent.get();
        }
        student.setTeacherId(request.getId());
        studentRepo.save(student);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public List<Student> getStudentsByTeacherId(Long id) {
        if (!teacherRepo.existsById(id)) {
            return new ArrayList<>();// TODO прописать нормально обработку ошибки
        }
        return studentRepo.findByTeacherId(id);
    }

    public User getByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }

    public UserDetailsService userDetailsService() {
        return this::getByEmail;
    }
}
