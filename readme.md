# Game Judge System
## Introduction
This is a judge system for site occupy game. The detail of the game is in the [game rule](./gamerule.pdf)  
There are four pages in the system:
- display page: display the game status
- stream page: stream UI for the game
- side judge page: set score and site occpuied status for each team
- main judge page: set the game status and verify score

## How to use
0. Set the team logo and name in the `frontend/src/assets/teaminfo.json` file
1. Set the IP for both backend and frontend in each `util` folder  
2. Run the backend server by `python backend-websocket/main.py`
3. Run the frontend server by `npm run start` in the `frontend` folder
4. Open the browser and go to the following pages  

|  Page   | Route  |
|  ----  | ----  |
| Display  | / |
| Stream  | /stream |
| White Side Judge  | /white |
| Black Side Judge  | /black |
| White Main Judge  | /main-white |
| Black Main Judge  | /main-black |

## Imoprtant Notice (READ BEFORE USE)
- If rerun the backend server, all the frontend pages should be refreshed
- ONLY ONE display page is allowed to be opened
- When counting down, do NOT refresh the display page otherwise the countdown will be reset
- If there is timeout for judge page, refresh the page
- Do NOT recall a site occupation in main judge page, you can only do it in side judge page
- The score log in judge page is not real time and you should get the newest log, but the score in display page is ALWAYS real time
- Everytime you set a new score, please double check with the display page

## Contact
Major Developer: [ZHANG Jiekai](mailto://jzhanger@connect.ust.hk)  
Developer: [IKEMURA Kei](mailto://kikemura@connect.ust.hk)  
Developer: [Wang Junzhe](mailto://jwanggj@connect.ust.hk)
