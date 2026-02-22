import asyncio
from services.ai_risk import ai_risk

async def main():
    res = await ai_risk("tell me a joke")
    print("Result:", res)

asyncio.run(main())
