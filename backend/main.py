from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Alfred")


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "assistant": "Alfred",
        "status": "Online",
        "message": "All good Jason? Systems operational."
    }


@app.post("/chat")
def chat(request: ChatRequest):
    return {
        "user": request.message,
        "alfred": f"You said: {request.message}"
    }