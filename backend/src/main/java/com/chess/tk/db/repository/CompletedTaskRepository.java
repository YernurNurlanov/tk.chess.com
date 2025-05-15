package com.chess.tk.db.repository;

import com.chess.tk.db.entity.CompletedTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompletedTaskRepository extends JpaRepository<CompletedTask, Long> {
    List<CompletedTask> findByStudentIdAndTaskIdIn(Long studentId, List<Long> taskIds);
    CompletedTask findByStudentIdAndTaskId(Long studentId, Long taskId);
    List<CompletedTask> findByStudentId(Long studentId);
}
