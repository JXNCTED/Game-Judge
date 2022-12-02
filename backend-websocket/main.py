from log import Logger
from side_referee import SideReferee
import asyncio
from datetime import datetime


def main():
    logger = Logger("log-"+datetime.now().strftime('%m-%dT%H:%M:%S'))
    refereeB = SideReferee(2222, "BLACK")
    refereeB.setLogger(logger)
    refereeW = SideReferee(3333, "WHITE")
    refereeW.setLogger(logger)

    while True:
        try:
            asyncio.get_event_loop().run_until_complete(refereeB.connect())
            asyncio.get_event_loop().run_until_complete(refereeW.connect())
            asyncio.get_event_loop().run_forever()
        except KeyboardInterrupt:
            break
        except:
            print("Connection Error. Retrying in 5 seconds...")
            asyncio.sleep(5)

if __name__ == "__main__":
    main()