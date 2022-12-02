# backend with websocket
## launch

## Side Referee API - Port 2222, 3333
| Direction | Category | Command | Parameter | Comment |
| ---- | ---- | ---- | ---- | ---- |
| Rx | Admin | Ready | None | ready or not for each team |
| Rx | Score | Update | SerialId | change the score according to the rule |
| Rx | Score | Modify | Number (+ Reason) | change the score manually |
| Rx | Request | Score | None | request current score |
| Tx | Ack | Command | NULL | received a command |
| Tx | Score | Log | log of the score | the response to score request |

## Main Referee API - Port 4444
| Direction | Category | Command | Parameter | Comment |
| ---- | ---- | ---- | ---- | ---- |
| Rx | Admin | Reset | NULL | start the preparation stage |
| Rx | Admin | Start | NULL | start the game |
| Rx | Admin | Finish | NULL | end the game |
| Rx | Site | Add | Side+Site+Type | occupy |
| Rx | Site | Remove | Side+Site+Type | remove |
| Rx | Request | Site | None | request current site occuption |
| Tx | Ack | Command | NULL | received a command |
| Tx | Response | Site | status of the sites | the response to Site request |

## Dashboard API - Port 5555
| Direction | Category | Command | Parameter | Comment |
| ---- | ---- | ---- | ---- | ---- |
| Rx | Ack | Command | NULL | the ack of receiving a response |
| Tx | Response | State | state of the game | return game state (preparation / ongoing / finish) |
| Tx | Response | Score | log of the score | the response to score request |
| Tx | Response | Site | status of the sites | the response to Site request |  

