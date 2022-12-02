from log import Logger
from side_referee import SideReferee
from main_referee import MainReferee
import asyncio
from datetime import datetime


async def main():
    logger = Logger()
    logger.create("log-"+datetime.now().strftime('%m-%dT%H:%M:%S'))
    refereeB = SideReferee(2222, "Black", logger)
    refereeW = SideReferee(3333, "White", logger)
    referee  = MainReferee(4444, logger)

    while True:
        try:
            task1 = asyncio.create_task(refereeB.connect())
            task2 = asyncio.create_task(refereeW.connect())
            task3 = asyncio.create_task(referee.connect())
            await asyncio.gather(task1, task2, task3)
        except KeyboardInterrupt:
            break

asyncio.run(main())
