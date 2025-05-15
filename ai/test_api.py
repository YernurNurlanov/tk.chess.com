import requests
import json

BASE_URL = "http://localhost:5001"


def print_json(title, data):
    print(f"\n{title}:")
    print(json.dumps(data, indent=2))


def test_move_analysis():
    print("\n=== Move Analysis ===")
    fen = input("Enter FEN position (or press Enter for default starting position): ")
    if not fen:
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

    move = input("Enter move in UCI format (e.g. e2e4): ")
    while not move:
        print("Please enter a valid move!")
        move = input("Enter move in UCI format (e.g. e2e4): ")

    response = requests.post(
        f"{BASE_URL}/analyze-move", json={"fen": fen, "move": move}
    )
    print_json("Move Analysis Result", response.json())


def test_ai_move():
    print("\n=== AI Move Generation ===")
    fen = input("Enter FEN position (or press Enter for default starting position): ")
    if not fen:
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

    skill_level = input("Enter AI skill level (1-6, default 3): ")
    try:
        skill_level = int(skill_level) if skill_level else 3
    except ValueError:
        skill_level = 3

    response = requests.post(
        f"{BASE_URL}/get-ai-move", json={"fen": fen, "skill_level": skill_level}
    )
    print_json("AI Move Response", response.json())


def test_game_analysis():
    print("\n=== Game Analysis ===")
    print(
        "Enter moves in UCI format one by one (e.g. e2e4). Enter 'done' when finished."
    )

    moves = []
    while True:
        move = input(f"Move {len(moves) + 1}: ").strip()
        if move.lower() == "done":
            break
        if move:
            moves.append(move)

    if not moves:
        print("Using sample moves since none were provided")
        moves = ["e2e4", "e7e5", "g1f3", "b8c6"]

    response = requests.post(f"{BASE_URL}/analyze-game", json={"moves": moves})
    print_json("Game Analysis Result", response.json())


def main():
    print("Interactive Chess API Tester")
    print("Make sure the Flask server is running in another terminal!")

    while True:
        print("\nOptions:")
        print("1. Test Move Analysis")
        print("2. Test AI Move Generation")
        print("3. Test Game Analysis")
        print("4. Exit")

        choice = input("Select an option (1-4): ")

        if choice == "1":
            test_move_analysis()
        elif choice == "2":
            test_ai_move()
        elif choice == "3":
            test_game_analysis()
        elif choice == "4":
            break
        else:
            print("Invalid choice, please try again")


if __name__ == "__main__":
    main()
