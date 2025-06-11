package com.chess.tk.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "game_analysis")
public class GameAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private Float accuracyScore;
    private String opening;
    private String skillLevel;

}

