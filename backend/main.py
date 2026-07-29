import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
    system_prompt = (
        "You are Alfred, an intelligent personal AI assistant. "
        "Be concise, helpful, friendly, and think step by step when needed."
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"{system_prompt}\n\nUser: {request.message}"
    )

    return {
        "response": response.text,
        "conversation_id": request.conversation_id,
        "model": "gemini-2.0-flash"
    }


@app.post("/api/upload")
def upload(file: dict):
    return {
        "filename": file.get("name"),
        "type": file.get("type"),
        "size": file.get("size"),
        "content": file.get("content")
    }
