import os
import aiohttp
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

async def generate_response(prompt: str):
    # Using gemini-pro which is generally available, or fallback to the one in use if preferred
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={API_KEY}"

    payload = {
        "contents": [{
            "parts": [{"text": f"Answer this prompt. Format your response using clear Markdown (headers, bullet points, code blocks where applicable).\n\nPrompt: {prompt}"}]
        }]
    }

    async with aiohttp.ClientSession() as session:
        for attempt in range(3):
            try:
                async with session.post(url, json=payload, timeout=10) as response:
                    if response.status == 429:
                        print(f"Gemini 429 Rate Limit. Retrying in {2**attempt}s...")
                        await asyncio.sleep(2 ** attempt)
                        continue
                        
                    response.raise_for_status()
                    data = await response.json()
                    
                    if "candidates" in data and data["candidates"]:
                        return data["candidates"][0]["content"]["parts"][0]["text"]
                    return "⚠️ Error: No response from Gemini."
            except aiohttp.ClientError as e:
                print(f"Gemini API Error: {e}")
                if attempt == 2:
                    return "⚠️ Error: Gemini is busy (Rate Limit). Try again in a moment."
            except KeyError:
                print("Gemini API Error: Unexpected response format")
                return "⚠️ Error: Unexpected response from Gemini."
            except Exception as e:
                 print(f"Gemini Unexpected Error: {e}")
                 return "⚠️ Error: Failed to connect to Gemini."
                 
    return "⚠️ Error: Failed to connect to Gemini."
