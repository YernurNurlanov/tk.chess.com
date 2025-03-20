package com.chess.tk.service;

import com.chess.tk.db.entities.Student;
import com.chess.tk.db.repositories.StudentRepository;
import com.chess.tk.db.repositories.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;

    public TeacherService(TeacherRepository teacherRepo, StudentRepository studentRepo) {
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
    }


    public ResponseEntity<String> addGroup(Long id, List<String> students) {

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<String> deleteGroup(Long id) {

        return ResponseEntity.status(HttpStatus.OK).body("Group with ID " + id + " was deleted");

    }

    public List<Student> getStudentsByTeacherId(Long id) {
        if (!teacherRepo.existsById(id)) {
            return new ArrayList<>();// TODO прописать нормально обработку ошибки
        }
        return studentRepo.findByTeacherId(id);
    }
}
