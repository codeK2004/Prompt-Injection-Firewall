# Prompt Injection Firewall

A full-stack AI security project that protects Large Language Model (LLM) applications from prompt injection attacks and data leakage. The system analyzes user prompts before sending them to an LLM (Google Gemini API) using a hybrid security model (Rule-based + AI-based).

## Features
- **Real-time Analysis**: Hybrid rule-based and AI-based risk scoring.
- **Live Dashboard**: React + Recharts dashboard with WebSocket updates.
- **Secure Storage**: PostgreSQL logging of all prompts and decisions.
- **Google Gemini Integration**: Uses `gemini-1.5-flash` for response generation and risk assessment.

## Prerequisites
- Python 3.8+
- Node.js & npm
- PostgreSQL (running locally)

## Configuration
1.  **Backend**: Check `backend/.env` and update `GEMINI_API_KEY` and `DATABASE_URL` if needed.
    ```env
    DATABASE_URL=postgresql://localhost:5432/firewall_db
    GEMINI_API_KEY=your_actual_api_key
    ```
2.  **Frontend**: No extra config needed.

## Running the Project

### 1. Start Support Services (PostgreSQL)
Ensure your PostgreSQL server is running and a database named `firewall_db` exists.
```bash
createdb firewall_db
```

### 2. Start Backend
Open a terminal in the `backend` folder:
```bash
cd backend
uvicorn main:app --reload
```
- It should run on `http://localhost:8000`.

### 3. Start Frontend
Open a new terminal in the `frontend` folder:
```bash
cd frontend
npm run dev
```
- It should run on `http://localhost:5173`.

## Verification

### Automated Test
With the backend running, you can run the test script in a new terminal window:
```bash
cd backend
python test_backend.py
```

### Manual Test
1.  Go to `http://localhost:5173`.
2.  Enter a prompt (e.g., "Write a poem").
3.  Click **Analyze**.
4.  See the result ("Allowed").
5.  Check the **Live Analytics** dashboard below; the charts should update instantly.

## Database Verification (Manual)
To check the raw data in your PostgreSQL database:

1.  Open a new terminal.
2.  Connect to the database:
    ```bash
    psql -d firewall_db
    ```
3.  Run these SQL commands:
    - **List all tables**:
      ```sql
      \dt
      ```
    - **See the last 5 prompts**:
      ```sql
      SELECT * FROM prompt_logs ORDER BY timestamp DESC LIMIT 5;
      ```
    - **Count total records**:
      ```sql
      SELECT count(*) FROM prompt_logs;
      ```
4.  Exit the database tool:
    ```sql
    \q
    ```
