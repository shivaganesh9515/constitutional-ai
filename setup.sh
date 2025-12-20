#!/bin/bash

echo "🚀 Setting up Nyaya AI..."

# 1. Install Ollama
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# 2. Start Ollama and pull model
ollama serve &
sleep 5
ollama pull gemma3:4b

# 3. Setup Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Setup Frontend
cd ../frontend
npm install

echo "✅ Setup complete!"
echo "Run backend: cd backend && uvicorn main:app --reload"
echo "Run frontend: cd frontend && npm run dev"