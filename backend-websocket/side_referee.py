import asyncio
import websockets
from utils import *

class SideReferee:
    def __init__(self, port, side):
        self.port = port
        self.side = side
        self.logger = None

    def setLogger(self, logger):
        self.logger = logger

    async def connect(self):
        async with websockets.serve(self.run, "localhost", self.port) as websocket:
            await asyncio.Future()

    async def run(self, websocket):
        while True:
            processed = 0
            request = await websocket.recv()
            category, cmd, param = requestDecoder(request)
            print(f"Received: {category} {cmd} {param}")
            if category == "Admin":
                if cmd == "Ready":
                    writeToLog(self.logger, ['Admin', self.side, 'Ready'])
                    processed = 1
            elif category == "Score":
                if cmd == "Update" and SCORE_INDEX[param[0]] is not None:
                    print(SCORE_INDEX[param[0]][1])
                    writeToLog(self.logger, ['Score', self.side, {SCORE_INDEX[param[0]][0]}, SCORE_INDEX[param[0]][1]])
                    processed = 1
                elif cmd == "Modify":
                    print(param[0])
                    writeToLog(self.logger, ['Score-Manual', self.side, "None" if len(param)==1 else param[1], param[0]])
                    processed = 1
            elif category == "Request" and cmd == "Score":
                await websocket.send(responseMsg("Score", "Log", self.logger.getLog(self.side, "Score")))
                processed = 2

            if processed == 0:
                await websocket.send(responseMsg("Ack", "Error", "Invalid Request"))
            elif processed == 1:
                await websocket.send(responseMsg("Ack", "Success", "Request Processed"))

