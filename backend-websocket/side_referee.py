import asyncio
import websockets
from datetime import datetime
from utils import *


class SideReferee:
    def __init__(self, port, side, logger):
        self.port = port
        self.side = side
        self.logger = logger
        self.webs = None

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
                if cmd == "Ready":
                    writeToLog(self.logger, ['Admin', self.side, 'Ready'])
                    processed = 1
                if cmd == "Reset":
                    self.logger.create(
                        "log-"+datetime.now().strftime('%m-%dT%H:%M:%S'))
                    if (param == 'None'):
                        writeToLog(self.logger, [
                                   'Admin', 'Both', 'Prepare', 0])
                    else:
                        writeToLog(self.logger, ['Admin', 'Both', 'Prepare', int(
                            param[0])*10+int(param[1])])
                    processed = 1
                if cmd == "PCount":
                    writeToLog(self.logger, ['Admin', 'Both', 'PCount'])
                    processed = 1
                if cmd == "Game":
                    writeToLog(self.logger, ['Admin', 'Both', 'Game'])
                    processed = 1
                if cmd == "Start":
                    writeToLog(self.logger, ['Admin', 'Both', 'Start'])
                    processed = 1
                if cmd == "Settle":
                    writeToLog(self.logger, ['Admin', 'Both', 'Settle'])
                    processed = 1
            elif category == "Site":
                if cmd == "Add":
                    writeToLog(self.logger, [
                               'Site', param[0], param[1], 1 if param[2] == "Soldier" else 3])
                    processed = 1
                if cmd == "Remove":
                    writeToLog(self.logger, [
                               'Site', param[0], param[1], -1 if param[2] == "Soldier" else -3])
                    processed = 1
            elif category == "Score":
                if cmd == "Update" and SCORE_INDEX[param[0]] is not None:
                    writeToLog(self.logger, [
                               'Score', self.side, SCORE_INDEX[param[0]][0], SCORE_INDEX[param[0]][1]])
                    processed = 1
                elif cmd == "Modify":
                    writeToLog(self.logger, [
                               'Score-Manual', self.side, "None" if len(param) == 1 else param[1], param[0]])
                    processed = 1
            elif category == "Request" and cmd == "Score":
                await websocket.send(responseMsg("Response", "Score", self.logger.getLog(self.side, "Score")))
                processed = 2

            if processed == 0:
                await websocket.send(responseMsg("Ack", "Error", "Invalid Request"))
            elif processed == 1:
                await websocket.send(responseMsg("Ack", "Success", "Request Processed"))
