package com.chess.tk.db.repository;

import com.chess.tk.db.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Task findByStartFinAndEndFin(String startFin, String endFin);
}
