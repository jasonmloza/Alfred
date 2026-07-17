from fastapi import FastAPI
from pydantic import BaseModel
import ollama

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {
        "assistant": "Alfred",
        "status": "online"
    }

@app.post("/chat")
def chat(request: ChatRequest):
    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Alfred, an intelligent personal AI assistant. "
                    "Be concise, helpful, friendly, and think step by step when needed."
                )
            },
            {
                "role": "user",
                "content": request.message
            }
        ]
    )

    return {
        "response": response["message"]["content"]
    }