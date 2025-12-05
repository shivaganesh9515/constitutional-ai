import asyncio
import websockets
import httpx
import json
import sys

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/ws/analyze"

async def test_backend_flow():
    print(f"🔍 Starting Backend Deep Dive Test...")
    print(f"--------------------------------------------------")

    # 1. Fetch a Sample Case
    print(f"\n1️⃣  Fetching Sample Case (Violation)...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}/sample-case-violation")
            response.raise_for_status()
            case_data = response.json()
            print(f"✅ Case Fetched: {case_data['title']}")
            print(f"   Value: ₹{case_data['estimated_value']:,}")
            print(f"   Method: {case_data['procurement_method']}")
        except Exception as e:
            print(f"❌ Failed to fetch case: {e}")
            return

    # 2. Connect to WebSocket for Analysis
    print(f"\n2️⃣  Connecting to Analysis Engine (WebSocket)...")
    try:
        async with websockets.connect(WS_URL) as websocket:
            print(f"✅ Connected to {WS_URL}")
            
            # Send the case data
            print(f"📤 Sending case data for analysis...")
            await websocket.send(json.dumps(case_data))

            # Listen for messages
            print(f"\n3️⃣  Streaming Agent Activities (Real-time Logs):")
            print(f"--------------------------------------------------")
            
            while True:
                try:
                    message = await websocket.recv()
                    data = json.loads(message)
                    
                    status = data.get("status")
                    
                    if status == "info":
                        print(f"ℹ️  [INFO] {data.get('message')}")
                    
                    elif status == "progress":
                        agent = data.get("agent").capitalize()
                        state = data.get("state")
                        print(f"🤖 [{agent} Agent] -> {state.upper()}")
                        
                    elif status == "complete":
                        print(f"\n✅ [COMPLETE] Analysis Finished!")
                        result = data.get("result")
                        verdict = result['verdict']
                        print(f"--------------------------------------------------")
                        print(f"⚖️  FINAL VERDICT: {verdict['verdict']}")
                        print(f"📊 Constitutional Score: {verdict['constitutional_score']}/100")
                        print(f"📝 Citizen Summary: {verdict['citizen_summary']}")
                        print(f"--------------------------------------------------")
                        break
                    
                    elif status == "error":
                        print(f"❌ [ERROR] {data.get('message')}")
                        break
                        
                except websockets.exceptions.ConnectionClosed:
                    print("⚠️  Connection closed by server.")
                    break
                    
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")
        print("   (Make sure the backend server is running!)")

if __name__ == "__main__":
    # Check if we are running in an async environment or need to start one
    try:
        asyncio.run(test_backend_flow())
    except KeyboardInterrupt:
        print("\n🛑 Test stopped by user.")
