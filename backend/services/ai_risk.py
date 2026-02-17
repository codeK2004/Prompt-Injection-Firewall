import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

def ai_risk(prompt: str):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={API_KEY}"

    payload = {
        "contents": [{
            "parts": [{"text": f"Classify this prompt as 'SAFE', 'SUSPICIOUS', or 'MALICIOUS'. Respond with only one word.\n\nPrompt: {prompt}"}]
        }]
    }

    import time
    
    for attempt in range(3):
        try:
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 429:
                time.sleep(2 ** attempt) # Exponential backoff: 1s, 2s, 4s
                continue
                
            if response.status_code != 200:
                return 0
            
            text = response.json()["candidates"][0]["content"]["parts"][0]["text"].strip().upper()
            
            if "MALICIOUS" in text:
                return 80
            elif "SUSPICIOUS" in text:
                return 40
            else:
                return 0
        except:
            return 0
    return 0
