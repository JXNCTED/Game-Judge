import asyncio
import websockets
from datetime import datetime
from utils import *

class MainReferee:
    def __init__(self, port, logger):
        self.port = port
        self.logger = logger

    async def connect(self):
        async with websockets.serve(self.run, IP_ADDRESS, self.port) as websocket:
            await asyncio.Future()

    async def run(self, websocket):
        while True:
            processed = 0
            request = await websocket.recv()
            category, cmd, param = requestDecoder(request)
            print(f"Received: {category} {cmd} {param}")
            if category == "Admin":
                if cmd == "Reset":
                    self.logger.create("log-"+datetime.now().strftime('%m-%dT%H:%M:%S'))
                    processed = 1
                if cmd == "Ready":
                    writeToLog(self.logger, ['Admin', 'Both', 'Game'])
                    processed = 1
                if cmd == "Start":
                    writeToLog(self.logger, ['Admin', 'Both', 'Start'])
                    processed = 1
                if cmd == "Finish":
                    writeToLog(self.logger, ['Admin', 'Both', 'Settle'])
                    processed = 1
            elif category == "Site":
                if cmd == "Add":
                    writeToLog(self.logger, ['Site', param[0], param[1], 1 if param[2]=="Soldier" else 3])
                    processed = 1
                if cmd == "Remove":
                    writeToLog(self.logger, ['Site', param[0], param[1], -1 if param[2]=="Soldier" else -3])
                    processed = 1
            elif category == "Request":
                if cmd == "Site":
                    await websocket.send(responseMsg("Response", "Site", self.logger.getLog("", "Site")))
                    processed = 2
            
            if processed == 0:
                await websocket.send(responseMsg("Ack", "Error", "Invalid Request"))
            elif processed == 1:
                await websocket.send(responseMsg("Ack", "Success", "Request Processed"))
    