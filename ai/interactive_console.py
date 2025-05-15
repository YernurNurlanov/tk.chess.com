from services.chess_ai_service import ChessAIService
import chess
import os


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


class InteractiveConsole:
    def __init__(self):
        self.ai = ChessAIService()
        self.board = chess.Board()
        self.history = []

    def display_menu(self):
        clear_screen()
        print("♔ Enhanced Chess AI Test Console ♔")
        print("\nCurrent Board:")
        print(self.board)
        print(f"\nFEN: {self.board.fen()}")
        print("\nOptions:")
        print("1. Analyze a move")
        print("2. Get AI move")
        print("3. Analyze current game")
        print("4. Make moves interactively")
        print("5. Reset board")
        print("6. Exit")

    def analyze_move(self):
        clear_screen()
        print("Current position:")
        print(self.board)
        move = input("\nEnter move in UCI (e.g. e2e4): ").strip()
        try:
            analysis = self.ai.analyze_move(self.board.fen(), move)
            print("\n=== Analysis ===")
            print(f"Move Quality: {analysis['strength']}")
            print(f"Suggestion: {analysis['suggestion']}")
            if analysis["pattern_feedback"]:
                print("\nPatterns Detected:")
                for feedback in analysis["pattern_feedback"]:
                    print(f"- {feedback}")
            input("\nPress Enter to continue...")
        except Exception as e:
            print(f"Error: {e}")
            input("Press Enter to continue...")

    def get_ai_move(self):
        clear_screen()
        print("Current position:")
        print(self.board)
        skill = input("\nEnter AI skill level (1-6, default 3): ").strip()
        skill = int(skill) if skill.isdigit() else 3
        result = self.ai.generate_move(self.board.fen(), skill)
        print(f"\nAI (Level {skill}) plays: {result['move']}")
        print(f"Reason: {result['explanation']}")
        self.board.push(chess.Move.from_uci(result["move"]))
        input("\nPress Enter to continue...")

    def analyze_game(self):
        if not self.history:
            print("No moves made yet!")
            input("Press Enter to continue...")
            return

        analysis = self.ai.analyze_game([m.uci() for m in self.history])
        clear_screen()
        print("=== Game Analysis ===")
        print(f"Skill Level: {analysis['skill_profile']['level'].title()}")
        print(f"Accuracy: {analysis['skill_profile']['accuracy_percentage']}%")

        print("\nWeaknesses:")
        for weakness in analysis["skill_profile"]["weaknesses"]:
            print(f"- {weakness}")

        print("\nRecommendations:")
        for rec in analysis["recommendations"]:
            print(f"- {rec['topic']} ({rec['type']}, priority: {rec['priority']}")

        input("\nPress Enter to continue...")

    def interactive_play(self):
        while not self.board.is_game_over():
            clear_screen()
            print("Current Board:")
            print(self.board)
            print("\nOptions:")
            print("1. Make a move")
            print("2. Get AI move")
            print("3. Back to main menu")

            choice = input("Select option: ").strip()

            if choice == "1":
                move = input("Your move (UCI): ").strip()
                try:
                    chess_move = chess.Move.from_uci(move)
                    if chess_move in self.board.legal_moves:
                        self.board.push(chess_move)
                        self.history.append(chess_move)
                        analysis = self.ai.analyze_move(self.board.fen(), move)
                        print(f"\n{analysis['strength']}")
                        print(f"Suggestion: {analysis['suggestion']}")
                        input("Press Enter to continue...")
                    else:
                        print("Illegal move!")
                        input("Press Enter to continue...")
                except ValueError:
                    print("Invalid move format!")
                    input("Press Enter to continue...")
            elif choice == "2":
                self.get_ai_move()
            elif choice == "3":
                break

    def run(self):
        while True:
            self.display_menu()
            choice = input("\nSelect option (1-6): ").strip()

            if choice == "1":
                self.analyze_move()
            elif choice == "2":
                self.get_ai_move()
            elif choice == "3":
                self.analyze_game()
            elif choice == "4":
                self.interactive_play()
            elif choice == "5":
                self.board.reset()
                self.history = []
            elif choice == "6":
                break
            else:
                print("Invalid choice!")
                input("Press Enter to continue...")


if __name__ == "__main__":
    console = InteractiveConsole()
    console.run()
