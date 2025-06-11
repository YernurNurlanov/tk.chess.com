package com.chess.tk.service;

import com.chess.tk.db.entity.*;
import com.chess.tk.db.repository.GameRepository;
import com.chess.tk.db.repository.MoveRepository;
import com.chess.tk.db.repository.StudentRepository;
import com.chess.tk.dto.gameWithAI.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final MoveRepository moveRepo;
    private final GameRepository gameRepo;
    private final StudentRepository studentRepo;

    public GameService(MoveRepository moveRepo, GameRepository gameRepo, StudentRepository studentRepo) {
        this.moveRepo = moveRepo;
        this.gameRepo = gameRepo;
        this.studentRepo = studentRepo;
    }

    public Long createGame(Long userId, String playerColor) {
        Student student = studentRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Student with id " + " not found"));

        Game game = new Game();
        game.setPlayer(student);
        game.setPlayerColor(playerColor);
        game.setInitialFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        game.setStartedAt(LocalDateTime.now());

        return gameRepo.save(game).getId();
    }

    public ResponseEntity<String> endGame(Long gameId, GameDTO dto) {
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game with id " + gameId + " not found"));

        game.setEndedAt(LocalDateTime.now());
        game.setResult(dto.getResult());
        gameRepo.save(game);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<String> saveGameAnalysis(Long gameId, GameAnalysisDTO dto) {
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game with id " + gameId + " not found"));

        GameAnalysis analysis = new GameAnalysis();
        analysis.setGame(game);
        analysis.setAccuracyScore(dto.getAccuracyScore());
        analysis.setOpening(dto.getOpening());
        analysis.setSkillLevel(dto.getSkillLevel());

        game.setAnalysis(analysis);
        gameRepo.save(game);

        return ResponseEntity.ok().build();
    }

    public GameStateDTO getGameState(Long gameId) {
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game not found"));

        List<MoveDTO> moves = moveRepo.findByGameIdOrderByIdAsc(gameId)
                .stream()
                .map(move -> {
                    MoveDTO dto = new MoveDTO();
                    dto.setFromSquare(move.getFromSquare());
                    dto.setToSquare(move.getToSquare());
                    dto.setSan(move.getSan());
                    dto.setFenBefore(move.getFenBefore());
                    dto.setFenAfter(move.getFenAfter());
                    return dto;
                })
                .collect(Collectors.toList());

        GameStateDTO state = new GameStateDTO();
        state.setPlayerColor(game.getPlayerColor());
        state.setResult(game.getResult());
        state.setMoves(moves);

        return state;
    }

    @Transactional
    public ResponseEntity<String> addMove(Long gameId, MoveDTO move, MoveAnalysisDTO moveAnalysis) {
        Move newMove = saveMove(gameId, move, true);
        newMove = moveRepo.save(newMove);

        MoveAnalysis analysis = new MoveAnalysis();
        analysis.setMove(newMove);
        analysis.setStrength(moveAnalysis.getStrength());
        analysis.setSuggestion(moveAnalysis.getSuggestion());
        analysis.setTopSuggestion(moveAnalysis.getTopSuggestion());
        analysis.setCategory(moveAnalysis.getCategory());
        newMove.setAnalysis(analysis);
        moveRepo.save(newMove);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<String> addAiMove(Long gameId, MoveDTO move) {
        moveRepo.save(saveMove(gameId, move, false));
        return ResponseEntity.ok().build();
    }

    private Move saveMove(Long gameId, MoveDTO move, Boolean isPlayerMove) {
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game with id " + gameId + " not found"));

        Move newMove = new Move();
        newMove.setGame(game);
        newMove.setFromSquare(move.getFromSquare());
        newMove.setToSquare(move.getToSquare());
        newMove.setSan(move.getSan());
        newMove.setFenBefore(move.getFenBefore());
        newMove.setFenAfter(move.getFenAfter());
        newMove.setIsPlayerMove(isPlayerMove);
        newMove.setPlayedAt(LocalDateTime.now());
        return newMove;
    }
}
