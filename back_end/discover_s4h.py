import httpx
import asyncio

async def discover_s4h():
    base_url = "http://api-auth.s4h.edu.vn"
    endpoints = [
        "/users",
        "/students",
        "/api/users",
        "/api/v1/users",
        "/all-users",
        "/accounts"
    ]
    
    async with httpx.AsyncClient() as client:
        for ep in endpoints:
            url = f"{base_url}{ep}"
            print(f"Testing {url}...")
            try:
                response = await client.get(url, timeout=5.0)
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    print(f"SUCCESS! Found endpoint: {ep}")
                    print(f"Preview: {response.text[:100]}")
            except Exception as e:
                print(f"Error: {e}")
            print("-" * 20)

if __name__ == "__main__":
    asyncio.run(discover_s4h())
