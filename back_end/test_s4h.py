import httpx
import asyncio

async def test_s4h():
    base_url = "http://api-auth.s4h.edu.vn"
    urls = [
        f"{base_url}/auth/login",
        f"{base_url}/users/me",
        "https://api-auth.s4h.edu.vn/auth/login" # Test HTTPS as well
    ]
    
    async with httpx.AsyncClient() as client:
        for url in urls:
            print(f"Testing {url}...")
            try:
                # Just a GET or empty POST to see if server responds
                response = await client.get(url, timeout=5.0)
                print(f"GET Status: {response.status_code}")
            except Exception as e:
                print(f"GET Error: {e}")
                
            try:
                response = await client.post(url, json={}, timeout=5.0)
                print(f"POST Status: {response.status_code}")
            except Exception as e:
                print(f"POST Error: {e}")
            print("-" * 20)

if __name__ == "__main__":
    asyncio.run(test_s4h())
