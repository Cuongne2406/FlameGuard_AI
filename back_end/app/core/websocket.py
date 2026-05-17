from fastapi import WebSocket
from typing import Dict, List
from uuid import UUID

class ConnectionManager:
    def __init__(self):
        # Maps user_id (UUID) to list of active WebSockets
        self.active_connections: Dict[UUID, List[WebSocket]] = {}

    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected to WebSocket. Total connections: {len(self.active_connections[user_id])}")

    def disconnect(self, user_id: UUID, websocket: WebSocket):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"User {user_id} disconnected from WebSocket.")

    async def send_personal_message(self, message: dict, user_id: UUID):
        if user_id in self.active_connections:
            print(f"Broadcasting websocket message to user {user_id}")
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending websocket message: {e}")

manager = ConnectionManager()
