from csv_logger import CsvLogger
import logging

class Logger:
    def __init__(self, log_file):
        header = ['Time', 'Category', 'Side', 'Event', 'Score']
        self.logger = CsvLogger(filename="log/" + log_file + ".csv", header=header)

    def log(self, message):
        self.logger.info(message)

    def getLog(self, side, event):
        if event == "Score":
            fi = filter(lambda x: (True if x[2] == None or x[2] == "BOTH" else x[2] == side) and (x[1] == "Score" or x[1] == "Score-Manual"), self.logger.get_logs())
            return list(map(lambda x: {"Time": x[0], "Side": x[2], "Event": x[3], "Score": x[4], "Type": "Rule" if x[1]=="Score" else "Manual"}, fi))
