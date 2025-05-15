from services.chess_ai_service import ChessAIService
import chess
import chess.svg
from IPython.display import display
import os


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def display_board(board):
    clear_screen()
    print("\nCurrent Board:")
    print(board)
    print(f"FEN: {board.fen()}\n")


def test_ai_interactively():
    ai = ChessAIService(engine_path="/opt/homebrew/bin/stockfish")
    board = chess.Board()

    print("Interactive Chess AI Tester")
    print("Enter moves in UCI format (e.g. e2e4)")
    print("Type 'ai' to let the AI make a move")
    print("Type 'undo' to take back last move")
    print("Type 'exit' to quit\n")

    while not board.is_game_over():
        display_board(board)

        cmd = input("Your move (or 'ai'/help/undo/exit): ").strip().lower()

        if cmd == "exit":
            break
        elif cmd == "help":
            print("\nAvailable commands:")
            print("ai - Let AI make a move")
            print("undo - Take back last move")
            print("exit - Quit the program")
            print("help - Show this help")
            print("Any valid UCI move (e.g. e2e4)")
            input("\nPress Enter to continue...")
            continue
        elif cmd == "undo":
            if len(board.move_stack) > 0:
                board.pop()
                print("Last move undone")
            else:
                print("No moves to undo")
            continue
        elif cmd == "ai":
            skill_level = input("AI skill level (1-6, default 3): ")
            try:
                skill_level = int(skill_level) if skill_level else 3
                skill_level = max(1, min(6, skill_level))
            except ValueError:
                skill_level = 3

            result = ai.generate_move(board.fen(), skill_level)
            move = chess.Move.from_uci(result["move"])
            board.push(move)
            print(f"AI (level {skill_level}) plays: {result['move']}")
            continue

        try:
            move = chess.Move.from_uci(cmd)
            if move not in board.legal_moves:
                print("Illegal move! Try again.")
                continue

            # Analyze player's move
            analysis = ai.analyze_move(board.fen(), cmd)
            print(f"\nMove analysis: {analysis['strength']}")
            print(f"Suggestion: {analysis['suggestion']}")

            board.push(move)
        except ValueError:
            print("Invalid move format! Try again.")

    if board.is_game_over():
        display_board(board)
        print("\nGame over! Result:", board.result())

        # Analyze full game
        moves = [move.uci() for move in board.move_stack]
        analysis = ai.analyze_game(moves)
        print("\n=== Game Analysis ===")
        print(f"Average move quality: {analysis['average_line']:.1f}")
        print(f"Skill level: {analysis['skill_level']}")
        print("\nMove breakdown:")
        for category, count in analysis["move_breakdown"].items():
            print(f"{category.capitalize()}: {count}")


if __name__ == "__main__":
    test_ai_interactively()
