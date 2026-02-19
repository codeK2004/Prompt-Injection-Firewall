# Prompt Injection Firewall AI 🛡️

**Prompt Injection Firewall AI** is an enterprise-grade security layer designed to protect Large Language Model (LLM) applications from prompt injection attacks, jailbreaks, and sensitive data leakage (PII). It acts as a real-time shield between your users and your LLM.

## 🚀 Key Features

*   **🛡️ Rule-Based Defense Engine**:
    *   **Zero-Latency Blocking**: Instantly blocks known jailbreak patterns (e.g., "DAN", "Mongo Tom") and rigid hacking attempts using optimized Regex.
    *   **PII Redaction**: Automatically detects and blocks requests containing sensitive data like Credit Card numbers, SSNs, and Phone numbers.
*   **⚔️ Red Team Attack Simulator**:
    *   **Live Testing**: One-click "Launch Attack Sim" button fires a sequence of simulated attacks (SQL Injection, XSS, Jailbreaks) to test firewall resilience in real-time.
*   **📡 Live Threat Monitor**:
    *   **Visualizing Attacks**: A "Matrix-style" real-time feed showing incoming payloads, decision logic, and risk scores.
    *   **Interactive Charts**: Beautiful area charts visualizing threat levels over time with gradient indicators.
*   **� Audit & Compliance**:
    *   **CSV Export**: Download comprehensive security reports with one click for compliance audits and forensic analysis.
    *   **History Log**: Searchable, filterable log of all blocked and allowed requests.
*   **⚡ High Performance**: Built with **FastAPI** (Async Python) and **React/Vite** for a blazing fast, non-blocking user experience.

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, Framer Motion (Animations), Recharts (Data Viz), Lucide React (Icons).
*   **Backend**: Python 3.10+, FastAPI, SQLAlchemy, SQLite/PostgreSQL.
*   **Protocol**: WebSockets (Real-time Full-Duplex Communication).

## 📦 Installation

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
# Optional: Only if you re-enable AI scoring
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./firewall.db
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start the Backend (API & WebSocket)
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Start the Frontend (Dashboard)
```bash
cd frontend
npm run dev
```
Open your browser to `http://localhost:5173`.

## 🛡️ Security Features
*   **SQL Injection Protection**: Detects common SQL manipulation patterns.
*   **XSS / Code Injection**: Blocks `<script>` tags and malicious code execution attempts.
*   **Social Engineering**: Identifies "Ignore previous instructions" style jailbreaks.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.
