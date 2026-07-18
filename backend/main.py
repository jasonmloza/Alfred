from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
import ollama

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    attachments: Optional[List[Any]] = None
    conversation_id: Optional[str] = None


@app.get("/")
def home():
    return {
        "assistant": "Alfred",
        "status": "online"
    }


@app.post("/api/chat")
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
        "response": response["message"]["content"],
        "conversation_id": request.conversation_id,
        "model": "llama3.2:3b"
    }


@app.post("/api/upload")
def upload(file: dict):
    return {
        "filename": file.get("name"),
        "type": file.get("type"),
        "size": file.get("size"),
        "content": file.get("content")
    }