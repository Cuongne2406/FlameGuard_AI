import httpx
import asyncio
import json

async def test_real_login():
    email = "cainnguyen2005@gmail.com"
    password = "Ntc24062005"
    base_url = "https://api-auth.s4h.edu.vn"
    url = f"{base_url}/auth/login"
    payload = {"email": email, "password": password}
    
    results = []
    results.append(f"Attempting login to {url} with {email}...")
    
    async with httpx.AsyncClient(verify=False) as client:
        try:
            response = await client.post(url, json=payload, timeout=10.0)
            results.append(f"Status Code: {response.status_code}")
            results.append(f"Response Body: {response.text}")
            results.append("Response Headers:")
            for k, v in response.headers.items():
                results.append(f"  {k}: {v}")
                
            if response.status_code in [200, 201]:
                token = None
                try:
                    data = response.json()
                    token = data.get("token") or data.get("accessToken") or data.get("access_token")
                    if token:
                        results.append(f"DEBUG: Found token in JSON BODY: {token[:15]}...")
                except:
                    pass
                
                if not token:
                    auth_header = response.headers.get("Authorization")
                    if auth_header and "Bearer" in auth_header:
                        token = auth_header.split(" ")[1]
                        results.append(f"DEBUG: Found token in RESPONSE HEADERS (Authorization): {token[:15]}...")
                
                if not token:
                    cookies = response.headers.get("Set-Cookie", "")
                    if "token=" in cookies:
                        token = cookies.split("token=")[1].split(";")[0]
                        results.append(f"DEBUG: Found token in COOKIES: {token[:15]}...")

                if token:
                    results.append("SUCCESS: Token retrieved.")
                    me_url = f"{base_url}/users/me"
                    me_resp = await client.get(me_url, headers={"Authorization": f"Bearer {token}"})
                    results.append(f"Me Status: {me_resp.status_code}")
                    if me_resp.status_code == 200:
                        results.append(f"Me Data: {json.dumps(me_resp.json(), indent=2)}")
                else:
                    results.append("FAILURE: Could not find token in response.")
            else:
                results.append(f"Login failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            results.append(f"Error during login: {e}")

    with open("s4h_test_results.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(results))

if __name__ == "__main__":
    asyncio.run(test_real_login())
