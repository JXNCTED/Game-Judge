import asyncio
import websockets
from datetime import datetime
from utils import *


class Display:
    def __init__(self, port, logger):
        self.port = port
        self.logger = logger
        self.webs = None

    async def connect(self):
        async with websockets.serve(self.run, "localhost", self.port) as websocket:
            await asyncio.Future()

    async def run(self, websocket):
        if self.webs is None:
            self.webs = websocket
        else:
            websocket.close()
            return
        while True:
            item = await self.logger.getQ()
            if item == "Score":
                await websocket.send(responseMsg("Response", "Score", self.logger.getLog("Both", "Score")))
            elif item == "Site":
                await websocket.send(responseMsg("Response", "Site", self.logger.getLog("", "Site")))
            elif item == "State":
                await websocket.send(responseMsg("Response", "State", self.logger.getLog("", "State")))
                
    