"""
A websocket server that receives results from the autonomous robots.
"""
import asyncio
import websockets
from datetime import datetime
from utils import *


class ResultReceiver():
    def __init__(self, port, side, logger) -> None:
        self.port = port
        self.side = side
        self.logger = logger
        self.webs = None

    async def connect(self):
        async with websockets.serve(self.run, IP_ADDRESS, self.port) as websocket:
            await asyncio.Future()

    async def run(self, websocket):
        processed = 0
        request = await websocket.recv()
        category, cmd, param = requestDecoder(request)
        print(f"Received: {category} {cmd} {param}")
