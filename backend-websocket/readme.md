# backend with websocket
## launch

## Side Referee API - Port 3333
| Direction | Category | Command | Parameter | Comment |
| ---- | ---- | ---- | ---- | ---- |
| Rx | Admin | Ready | B/W | ready or not for each team |
| Rx | Score | Update | B/W + SerialId | change the score according to the rule |
| Rx | Score | Modify | B/W + Number (+ Reason) | change the score manually |
| Rx | Request | Score | B/W | request current score |
| Tx | Ack | Command | NULL | received a command |
| Tx | Score | Log | log of the score | the response to score request |

## Main Referee API - Port 4444
| Direction | Category | Command | Parameter | Comment |
| ---- | ---- | ---- | ---- | ---- |
| Rx | Admin | Reset | NULL | start the preparation stage |
| Rx | Admin | Start | NULL | start the game |
| Rx | Admin | Finish | NULL | end the game |
| Rx | Request | Score | B/W | request current score |
| Rx | Request | Site |  | request current site occuption |
| Tx | Ack | Command | NULL | received a command |
| Tx | Response | Score | log of the score | the response to score request |
| Tx | Response | Site | status of the sites | the response to Site request |

## Dashboard API - Port 5555
| Rx | Ack | Command | NULL | the ack of receiving a response |
| Tx | Response | State | state of the game | return game state (preparation / ongoing / finish) |
| Tx | Response | Score | log of the score | the response to score request |
| Tx | Response | Site | status of the sites | the response to Site request |
