import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

def generate_response(prompt: str):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={API_KEY}"

    payload = {
        "contents": [{
            "parts": [{"text": f"Answer this prompt. Format your response using clear Markdown (headers, bullet points, code blocks where applicable).\n\nPrompt: {prompt}"}]
        }]
    }

    import time

    for attempt in range(3):
        try:
            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 429:
                print(f"Gemini 429 Rate Limit. Retrying in {2**attempt}s...")
                time.sleep(2 ** attempt)
                continue
                
            response.raise_for_status()
            data = response.json()
            if "candidates" in data and data["candidates"]:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            return "⚠️ Error: No response from Gemini."
        except requests.exceptions.RequestException as e:
            print(f"Gemini API Error: {e}")
            if attempt == 2:
                return "⚠️ Error: Gemini is busy (Rate Limit). Try again in a moment."
        except KeyError:
            print("Gemini API Error: Unexpected response format")
            return "⚠️ Error: Unexpected response from Gemini."
    return "⚠️ Error: Failed to connect to Gemini."
