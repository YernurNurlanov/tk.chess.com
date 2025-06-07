# Use a Python base image
FROM python:3.11-slim


# Install Stockfish and create symlink for macOS path
RUN apt-get update && \
    apt-get install -y stockfish && \
    mkdir -p /opt/homebrew/bin && \
    ln -s /usr/games/stockfish /opt/homebrew/bin/stockfish



# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY ai_requirements.txt .
RUN pip install --no-cache-dir -r ai_requirements.txt

# Copy AI application code
COPY . .

# Ensure Flask listens on all interfaces
CMD ["python", "main.py"]
