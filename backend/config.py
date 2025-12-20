from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Nyaya AI"
    OLLAMA_URL: str = "http://localhost:11434"
    MODEL_NAME: str = "gemma3:4b"
    CHROMA_PATH: str = "./chroma_db"
    
    class Config:
        env_file = ".env"

settings = Settings()
