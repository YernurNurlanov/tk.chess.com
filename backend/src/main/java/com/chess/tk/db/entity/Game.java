package com.chess.tk.db.entity;

import com.chess.tk.db.enums.GameResult;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Student player;
    private String playerColor;

    private String initialFen;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    @Enumerated(EnumType.STRING)
    private GameResult result;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<Move> moves = new ArrayList<>();

    @OneToOne(mappedBy = "game", cascade = CascadeType.ALL)
    private GameAnalysis analysis;
}

