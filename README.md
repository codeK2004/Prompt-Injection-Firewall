# Injection Firewall AI

**Injection Firewall AI** is a cutting-edge security layer designed to protect Large Language Model (LLM) applications from prompt injection attacks, jailbreaks, and sensitive data leakage (PII). It sits between your users and your LLM, analyzing every request in real-time using a hybrid defense engine.


## 🚀 Features

*   **🛡️ Real-Time Threat Detection**: Instantly analyzes prompts using a dual-engine approach:
    *   **Rule Engine**: Regex & keyword matching for known jailbreaks (e.g., "ignore previous instructions") and PII (Phone numbers, Emails, SSN).
    *   **AI Risk Assessment**: Uses Google Gemini to understand the *intent* and context of the prompt, flagging subtle social engineering attacks.
*   **📡 Live Threat Monitor**: A Matrix-style real-time feed that visualizes incoming attacks, their risk scores, and block/allow decisions instantly via WebSockets.
*   **📊 Analytics Dashboard**: Visualizes traffic trends, attack distribution, and average risk scores.
*   **📜 Audit History**: A searchable log of all past transactions for forensic analysis.
*   **⚙️ Configurable Security**: Adjust sensitivity levels and notification settings (UI implemented).
*   **⚡ High Performance**: Built with asynchronous Python (`aiohttp`) to ensure non-blocking, lightning-fast analysis.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Framer Motion (Animations), Recharts (Analytics), Lucide React (Icons).
*   **Backend**: Python, FastAPI, SQLAlchemy (SQLite/PostgreSQL compatible), Google Gemini API.
*   **Protocol**: WebSocket (Real-time updates), REST API.

## 📦 Installation

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   Google Gemini API Key

### 1. Clone & Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
DATABASE_URL=sqlite:///./firewall.db
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start the Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Start the Frontend
```bash
cd frontend
npm run dev
```
Open your browser to `http://localhost:5173`.

## 🛡️ Security & Privacy
*   **Sensitive Data**: The firewall is configured to detect and BLOCK requests containing PII (Personally Identifiable Information) like phone numbers and email addresses.
*   **Edge Processing**: Designed to be deployed as a sidecar or gateway service.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.
