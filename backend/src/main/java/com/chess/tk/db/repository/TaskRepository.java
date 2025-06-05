package com.chess.tk.db.repository;

import com.chess.tk.db.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Task findByStartFinAndEndFin(String startFin, String endFin);

    @Query("SELECT t FROM Task t WHERE t.endFin = ''")
    List<Task> findTasksWithEmptyEndFin();

    @Query("SELECT t FROM Task t WHERE t.endFin <> ''")
    List<Task> findTasksWithNonEmptyEndFin();
}
