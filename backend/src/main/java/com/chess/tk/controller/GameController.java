package com.chess.tk.controller;

import com.chess.tk.dto.gameWithAI.*;
import com.chess.tk.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/")
    public Long createGame(@RequestBody CreateGameRequest request) {
        return gameService.createGame(request.getUserId(), request.getPlayerColor());
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<String> endGame(@PathVariable Long id, @RequestBody GameDTO request) {
        return gameService.endGame(id, request);
    }

    @GetMapping("/{id}/state")
    public ResponseEntity<GameStateDTO> getGameState(@PathVariable Long id) {
        GameStateDTO gameState = gameService.getGameState(id);
        return ResponseEntity.ok(gameState);
    }

    @PostMapping("/{id}/game-analysis")
    public ResponseEntity<String> saveGameAnalysis(@PathVariable Long id, @RequestBody GameAnalysisDTO request) {
        return gameService.saveGameAnalysis(id, request);
    }

    @PostMapping("/{id}/moves")
    public ResponseEntity<String> addMove(@PathVariable Long id, @RequestBody AddMoveRequest request) {
        return gameService.addMove(id, request.getMove(), request.getMoveAnalysis());
    }

    @PostMapping("/{id}/ai-moves")
    public ResponseEntity<String> addAiMove(@PathVariable Long id,@RequestBody MoveDTO move) {
        return gameService.addAiMove(id, move);
    }
}
