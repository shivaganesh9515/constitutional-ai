
import asyncio
import httpx
from config import settings

async def list_models():
    print(f"Checking models at {settings.OLLAMA_URL}...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{settings.OLLAMA_URL}/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                print("INSTALLED MODELS:")
                for m in models:
                    print(f"- {m['name']}")
                
                if not any(m['name'] == settings.MODEL_NAME for m in models):
                    print(f"\nWARNING: Configured model '{settings.MODEL_NAME}' is NOT in the list.")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
