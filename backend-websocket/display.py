import asyncio
import websockets
from datetime import datetime
from utils import *


class Display:
    def __init__(self, port, logger):
        self.port = port
        self.logger = logger
        self.webs = None
        self.clients = set()

    async def connect(self):
        async with websockets.serve(self.run, IP_ADDRESS, self.port) as websocket:
            await self.broadcast_messages()

    async def run(self, websocket):
        await websocket.send(responseMsg("Response", "State", self.logger.getLog("", "State")))
        await asyncio.sleep(0.1)
        await websocket.send(responseMsg("Response", "Site", self.logger.getLog("", "Site")))
        await asyncio.sleep(0.1)
        await websocket.send(responseMsg("Response", "Score", self.logger.getLog("Both", "Score")))
        self.clients.add(websocket)
        try:
            while True:
                request = await websocket.recv()
                category, cmd, param = requestDecoder(request)
                print(f"Received: {category} {cmd} {param}")
                if category == "Score":
                    if cmd == "Update":
                        writeToLog(self.logger, [
                                   'Score', param[0], SCORE_INDEX['OccupyZero'][0], SCORE_INDEX['OccupyZero'][1]])
            # await websocket.wait_closed()
        finally:
            self.clients.remove(websocket)

    async def broadcast(self, message):
        for websocket in self.clients.copy():
            try:
                await websocket.send(message)
            except websockets.ConnectionClosed:
                pass

    async def broadcast_messages(self):
        while True:
            item = await self.logger.getQ()
            message = None
            if item == "Score":
                message = responseMsg(
                    "Response", "Score", self.logger.getLog("Both", "Score"))
            elif item == "Site":
                message = responseMsg("Response", "Site",
                                      self.logger.getLog("", "Site"))
            elif item == "State":
                message = responseMsg(
                    "Response", "State", self.logger.getLog("", "State"))
            if message == None:
                continue
            await self.broadcast(message)
            if item == "State":
                await asyncio.sleep(0.1)
                await self.broadcast(responseMsg("Response", "Site", self.logger.getLog("", "Site")))
                await asyncio.sleep(0.1)
                await self.broadcast(responseMsg("Response", "Score", self.logger.getLog("Both", "Score")))
