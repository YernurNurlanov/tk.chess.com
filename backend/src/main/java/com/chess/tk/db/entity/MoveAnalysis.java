package com.chess.tk.db.entity;

import com.chess.tk.db.enums.Category;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "move_analysis")
public class MoveAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "move_id", unique = true)
    private Move move;

    private String strength;
    private String suggestion;
    private String topSuggestion;

    @Enumerated(EnumType.STRING)
    private Category category;
}
