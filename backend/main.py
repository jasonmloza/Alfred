from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

# Lets the frontend (opened as a local file, or served from another port)
# call this API from the browser. Tighten allow_origins before deploying
# this publicly — "*" is fine for local hackathon dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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