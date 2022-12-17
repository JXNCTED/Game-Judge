def responseMsg(category, cmd, param):
    return f"{category}^{cmd}^{param}"

def requestDecoder(request):
    data = request.split("^")
    category = "None" if len(data) == 0 else data[0]
    cmd = "None" if len(data) == 1 else data[1]
    param = "None" if len(data) == 2 else data[2].split("+")
    return category, cmd, param

def writeToLog(logger, msg):
    if logger is not None:
        if len(msg) == 3:
            msg.append(0)
        logger.log(msg)

SCORE_INDEX = {
    'StayRampS': ['Carrier Staying on the Ramp', 10], 
    'OccupyZero': ['Occupying Site 0 for 1 minute', 20], 
    'StayRampE': ['Stay on the ramp', 15], 
    'Occupy': ['Occupy One Site', 80], 

    'FailStayRampS': ['Carrier Not Staying on the Ramp', -20], 
    'PauseOne': ['Technical Pause for 1 min', -10], 
    'CrashWall': ['Carrier Stepping over the Wall', -3], 
    'Bomb': ['Engineer Taking out a Bomb', -30], 
    'CarrierOut': ['Carrier Going Out of the Field', -30], 
    'DBlocking': ['Deliberate striking or blocking the opponent', -20], 
    'DMoving': ['Deliberate moving the Soldier/General of other team in Site', -30], 
    'Stepping': ['Team Member Stepping into the Field', -100], 
    'Restricted': ['Carrier Going into the Restricted Area', -30], 

    'DepSoldier': ['Deploy a Soldier', 5], 
    'DepGeneral': ['Deploy a General', 10], 
    'RecSoldier': ['Recall a Soldier', -5], 
    'RecGeneral': ['Recall a General', -10],
}

# IP_ADDRESS = "localhost"
IP_ADDRESS = "10.89.2.207"
