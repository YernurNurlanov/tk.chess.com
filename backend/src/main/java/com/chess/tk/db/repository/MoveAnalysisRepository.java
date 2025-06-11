package com.chess.tk.db.repository;

import com.chess.tk.db.entity.MoveAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MoveAnalysisRepository extends JpaRepository<MoveAnalysis, Long> {
}
