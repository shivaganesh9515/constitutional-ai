
import asyncio
import sys
import os

# Add current directory to path so we can import local modules
sys.path.append(os.getcwd())

from utils.llm_client import call_ollama
from config import settings

async def main():
    print(f"Testing connection to {settings.OLLAMA_URL} with model {settings.MODEL_NAME}...")
    try:
        response = await call_ollama("Who are you? Respond in 1 short sentence.")
        print("\nSUCCESS! Model responded:")
        print(f"> {response}")
    except Exception as e:
        print(f"\nFAILURE: {e}")
        # Only show troubleshooting if actual connection failure, not just code error
        if "Ollama error" in str(e): 
             print("\nTroubleshooting tips:")
             print(f"1. Is Ollama running at {settings.OLLAMA_URL}?")
             print(f"2. Have you pulled the model? Run: 'ollama pull {settings.MODEL_NAME}'")

if __name__ == "__main__":
    asyncio.run(main())
