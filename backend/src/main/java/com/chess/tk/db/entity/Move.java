package com.chess.tk.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "moves")
public class Move {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private String fromSquare;
    private String toSquare;
    private String san;

    private String fenBefore;
    private String fenAfter;

    private Boolean isPlayerMove;
    private LocalDateTime playedAt;

    @OneToOne(mappedBy = "move", cascade = CascadeType.ALL, orphanRemoval = true)
    private MoveAnalysis analysis;
}
