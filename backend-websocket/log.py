from csv_logger import CsvLogger
import logging
import queue
import asyncio
import json


class Logger:
    def __init__(self):
        self.header = ['Time', 'Category', 'Side', 'Event', 'Score']
        self.q = queue.Queue()

    async def getQ(self):
        if self.q.empty():
            await asyncio.sleep(0.1)
        else:
            return self.q.get()

    def create(self, name):
        self.q.queue.clear()
        header = ['Time', 'Category', 'Side', 'Event', 'Score']
        self.logger = CsvLogger(filename="log/" + name + ".csv", header=self.header)
        # self.log(['Admin', 'Both', 'Prepare', '0'])

    def log(self, message):
        self.logger.info(message)
        if(message[0] == "Score" or message[0] == "Score-Manual"):
            self.q.put("Score")
        elif(message[0] == "Site"):
            self.q.put("Site")
        elif(message[0] == "Admin"):
            self.q.put("State")

    def getLog(self, side, event):
        if event == "Score":
            fi = filter(lambda x: (True if side == None or side == "Both" else x[2] == side) and (x[1] == "Score" or x[1] == "Score-Manual"), self.logger.get_logs())
            return json.dumps(list(map(lambda x: {"Time": x[0], "Side": x[2], "Event": x[3], "Score": x[4], "Type": "Rule" if x[1]=="Score" else "Manual"}, fi)))
        if event == "Site":
            fi = filter(lambda x: x[1] == "Site", self.logger.get_logs())
            res = [{"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}]
            for i in fi:
                res[int(i[3])]["Black" if i[2] == "Black" else "White"] += int(i[4])
            return json.dumps(res)
        if event == "State":
            fi = filter(lambda x: x[1] == "Admin", self.logger.get_logs())
            res = {"State": "Prepare", "Team": {"Black": 0, "White": 0}, "Ready": {"Black": False, "White": False}}
            for i in fi:
                if i[2] == "Both":
                    res["State"] = i[3]
                    if i[3] == "Prepare":
                        res["Team"] = {"Black": int(i[4]) // 10, "White": int(i[4]) % 10}
                elif i[3] == "Ready":
                    res["Ready"][i[2]] = True
            if (res["Team"]["Black"] == 0 or res["Team"]["White"] == 0):
                res["State"] = "None"
            return json.dumps(res)
