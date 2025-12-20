import httpx
import json
from config import settings

async def call_ollama(prompt: str, system_prompt: str = "") -> str:
    """Call local Ollama LLM using Chat API (Model Agnostic)"""
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    
    messages.append({"role": "user", "content": prompt})
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Use /api/chat instead of /api/generate context handling
        response = await client.post(
            f"{settings.OLLAMA_URL}/api/chat",
            json={
                "model": settings.MODEL_NAME,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "num_predict": 2000
                }
            }
        )
        
        if response.status_code != 200:
            raise Exception(f"Ollama error: {response.text}")
        
        return response.json()["message"]["content"]

def parse_json_response(response: str) -> dict:
    """Extract JSON from LLM response"""
    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
    except json.JSONDecodeError:
        pass
    return {"error": "Parse failed", "raw": response}
