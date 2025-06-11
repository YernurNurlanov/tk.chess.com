package com.chess.tk.db.repository;

import com.chess.tk.db.entity.GameAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameAnalysisRepository extends JpaRepository<GameAnalysis, Long> {

}
