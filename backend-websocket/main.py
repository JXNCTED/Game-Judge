from log import Logger
from side_referee import SideReferee
from main_referee import MainReferee
from result_receiver import ResultReceiver
from display import Display
import asyncio
from datetime import datetime


async def main():
    logger = Logger()
    logger.create("log-"+datetime.now().strftime('%m-%dT%H:%M:%S'))
    refereeB = SideReferee(2222, "Black", logger)
    refereeW = SideReferee(3333, "White", logger)
    # referee  = MainReferee(4444, logger)
    display = Display(5555, logger)
    resultReceiverB = ResultReceiver(6666, "Black", logger)
    resultReceiverW = ResultReceiver(7777, "White", logger)

    while True:
        try:
            taskRefereeB = asyncio.create_task(refereeB.connect())
            taskRefereeW = asyncio.create_task(refereeW.connect())
            # task3 = asyncio.create_task(referee.connect())
            taskDisplay = asyncio.create_task(display.connect())
            # taskResultReceiverB = asyncio.create_task(
            #     resultReceiverB.connect())
            # taskResultReceiverW = asyncio.create_task(
            #     resultReceiverW.connect())
            await asyncio.gather(taskRefereeB, taskRefereeW, taskDisplay)

        except KeyboardInterrupt:
            break

asyncio.run(main())
