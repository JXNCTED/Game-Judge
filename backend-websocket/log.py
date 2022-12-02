from csv_logger import CsvLogger
import logging

class Logger:
    def __init__(self):
        self.header = ['Time', 'Category', 'Side', 'Event', 'Score']

    def create(self, name):
        header = ['Time', 'Category', 'Side', 'Event', 'Score']
        self.logger = CsvLogger(filename="log/" + name + ".csv", header=self.header)

    def log(self, message):
        self.logger.info(message)

    def getLog(self, side, event):
        if event == "Score":
            fi = filter(lambda x: (True if x[2] == None or x[2] == "Both" else x[2] == side) and (x[1] == "Score" or x[1] == "Score-Manual"), self.logger.get_logs())
            return list(map(lambda x: {"Time": x[0], "Side": x[2], "Event": x[3], "Score": x[4], "Type": "Rule" if x[1]=="Score" else "Manual"}, fi))
        if event == "Site":
            fi = filter(lambda x: x[1] == "Site", self.logger.get_logs())
            res = [{"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}, {"Black": 0, "White": 0}]
            for i in fi:
                res[int(i[3])]["Black" if i[2] == "Black" else "White"] += int(i[4])
            return res

