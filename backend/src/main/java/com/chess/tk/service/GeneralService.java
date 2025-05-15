package com.chess.tk.service;

import com.chess.tk.db.entity.Student;
import com.chess.tk.db.entity.Task;
import com.chess.tk.db.entity.Teacher;
import com.chess.tk.db.entity.User;
import com.chess.tk.db.enums.TaskLevel;
import com.chess.tk.db.repository.StudentRepository;
import com.chess.tk.db.repository.TaskRepository;
import com.chess.tk.db.repository.TeacherRepository;
import com.chess.tk.db.repository.UserRepository;
import com.chess.tk.dto.LevelTasksDTO;
import com.chess.tk.dto.SignInRequest;
import com.chess.tk.dto.TopicTasksDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class GeneralService {
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StudentRepository studentRepo;
    private final TeacherRepository teacherRepo;
    private final TaskRepository taskRepo;

    public ResponseEntity<?> signIn(SignInRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User with email " + request.getEmail() + " not found"));

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        var jwt = jwtService.generateToken(user);

        return ResponseEntity.ok()
                .header("Set-Cookie", "jwt=" + jwt + "; HttpOnly; Path=/; Max-Age=86400")
                .body(Map.of(
                        "message", "Successful login",
                        "role", user.getRole()
                ));
    }

    public User getCurrentUser(String jwt) {
        String email = jwtService.extractUserName(jwt);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not found"));
    }

    public List<Student> getStudentsByTeacherId(Long id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher with id " + id + " not found"));

        return studentRepo.findByTeacherId(teacher.getId());
    }

    public List<LevelTasksDTO> getTasks() {
        List<Task> tasks = taskRepo.findAll();

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
