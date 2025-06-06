import requests
import zstandard as zstd
import os
import sys
from datetime import datetime


def download_lichess_month(year: int, month: int):
    """Download and decompress a Lichess dataset for a specific month"""
    # Create directories if they don't exist
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)

    filename = f"{year}-{month:02d}"
    url = f"https://database.lichess.org/standard/lichess_db_standard_rated_{filename}.pgn.zst"

    print(f"Downloading {url}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Raise error for bad status

    zst_path = f"data/raw/{filename}.pgn.zst"
    with open(zst_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"Download complete. Decompressing {zst_path}...")

    # Decompress
    dctx = zstd.ZstdDecompressor()
    with open(zst_path, "rb") as compressed:
        with open(f"data/processed/{filename}.pgn", "wb") as decompressed:
            dctx.copy_stream(compressed, decompressed)

    print(f"Decompression complete. File saved to data/processed/{filename}.pgn")


if __name__ == "__main__":
    # Default to previous month
    current_date = datetime.now()
    year = 2019
    month = 5

    if month == 0:
        year -= 1
        month = 12

    # Use command-line arguments if provided
    if len(sys.argv) == 3:
        try:
            year = int(sys.argv[1])
            month = int(sys.argv[2])
        except ValueError:
            print(
                "Invalid arguments. Usage: python download_datasets.py [year] [month]"
            )
            sys.exit(1)

    download_lichess_month(year, month)
