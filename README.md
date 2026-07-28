# 🤖 Alfred AI Assistant

> **A.L.F.R.E.D — Autonomous Local Framework for Reasoning, Execution, and Dialogue**

A private, customizable AI assistant powered by local AI models.

Inspired by futuristic assistants like JARVIS, Alfred combines a modern React interface, a FastAPI backend, and local AI inference using Ollama. Alfred is built around a simple principle: **powerful AI should run on your own machine, privately, without sending your data anywhere.**

---

## ⚡ Hackathon Note

The frontend is currently configured to call a hosted backend at `https://alfred-cqac.onrender.com` so that hackathon participants can try Alfred without needing to run anything locally.

**Alfred was designed to be fully local.** The Render deployment is a temporary convenience — Alfred's real home is your machine. If you want to run it the way it was meant to be run, follow the local setup instructions below and change `API_BASE_URL` back in `frontend/src/lib/api.ts`:

```ts
// For local development (default / intended)
export const API_BASE_URL = "http://localhost:8000";

// For the hackathon hosted demo
export const API_BASE_URL = "https://alfred-cqac.onrender.com";
```

---

## ✨ Features

### Current

- ✅ AI-powered conversations
- ✅ Local AI inference using Ollama
- ✅ FastAPI backend
- ✅ React + TypeScript interface
- ✅ Real-time chat responses
- ✅ Private local AI processing
- ✅ Modular architecture
- ✅ Conversation management system

### Planned

- 🚧 Voice interaction & text-to-speech
- 🚧 Long-term memory
- 🚧 Personal preferences
- 🚧 Tool integrations
- 🚧 Desktop & mobile companion app
- 🚧 Autonomous task execution

---

## 🧠 How Alfred Works

```
User
 ↓
Alfred Interface (React + TypeScript)
 ↓
FastAPI Backend
 ↓
Ollama AI Engine
 ↓
Local Language Model (llama3.2:3b)
 ↓
Alfred Response
```

Alfred processes messages through a FastAPI API, sends them to a local language model through Ollama, and returns an intelligent response — all on your own hardware.

---

## 🏗️ Architecture

```
Alfred/
├── backend/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │       └── api.ts        ← API_BASE_URL lives here
│   └── package.json
├── requirements.txt
└── README.md
```

---

## 🛠️ Tech Stack

**Backend**
- Python, FastAPI, Uvicorn

**AI**
- Ollama, llama3.2:3b

**Frontend**
- React, TypeScript, Vite, Tailwind CSS, Framer Motion

---

## 🚀 Local Setup (Recommended)

### Prerequisites

- Python 3.10+
- Node.js
- Git
- [Ollama](https://ollama.com)

### 1. Clone Alfred

```bash
git clone https://github.com/jasonmloza/Alfred.git
cd Alfred
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Setup Ollama

```bash
# Pull Alfred's AI model
ollama pull llama3.2:3b

# Start Ollama
ollama serve
```

### 4. Start Backend

```bash
uvicorn backend.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`  
API docs at `http://127.0.0.1:8000/docs`

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

> Make sure `API_BASE_URL` in `frontend/src/lib/api.ts` is set to `http://localhost:8000` for local use.

---

## 📡 API

**POST** `/api/chat`

```json
// Request
{ "message": "Hello Alfred" }

// Response
{ "response": "Hello! How can I help you today?", "model": "llama3.2:3b" }
```

---

## 🌟 Project Journey

Alfred started as an idea: a personal AI assistant inspired by fictional assistants like JARVIS — but private, local, and yours.

- ✅ FastAPI backend built
- ✅ Ollama integration added
- ✅ Local AI model running
- ✅ React frontend built
- ✅ Frontend connected to backend
- ✅ Alfred successfully responding
- 🔜 Memory system
- 🔜 Voice capabilities
- 🔜 Autonomous tools

---

## 🎯 Vision

Alfred is built around the idea that powerful AI should be private, customizable, and run on your own device. The long-term goal is a fully capable personal AI companion that understands context, remembers useful information, interacts through voice, and connects with your tools — all without leaving your machine.

---

## 👨‍💻 Developer

Built by [Jason Mloza](https://github.com/jasonmloza)

---

## 🤝 Contributing

Contributions, suggestions, and ideas are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📜 License

MIT License

---

## ⭐ Support

If you like Alfred, consider starring the repository ⭐
