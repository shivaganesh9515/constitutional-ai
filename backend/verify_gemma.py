
import asyncio
import sys
import os

sys.path.append(os.getcwd())

from utils.llm_client import call_ollama
from config import settings

async def main():
    print(f"Verifying connection to {settings.MODEL_NAME}...")
    try:
        response = await call_ollama("Hello! Are you working? Respond in one word.")
        print(f"SUCCESS: Received response: '{response}'")
    except Exception as e:
        print(f"ERRORED: {e}")

if __name__ == "__main__":
    asyncio.run(main())
