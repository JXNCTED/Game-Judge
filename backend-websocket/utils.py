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
    'Wiring': ['Time-limited Welding Challenge', 15],
    'StayRampS': ['Carrier Staying on the Ramp', 15],
    'OccupyZero': ['Occupying Site 0 for 1 minute', 20],
    # 'DepSoldier': ['Deploy a Soldier', 5],
    # 'DepGeneral': ['Deploy a General', 10],
    'Occupy': ['Occupy One Site', 80],

    'CrashWall': ['Carrier Stepping over the Wall', -3],
    'Bomb': ['Engineer Taking out a Bomb', -20],
    'CarrierOut': ['Carrier Going Out of the Field', -10],
    'DBlocking': ['Striking or blocking the opponent', -20],
    'DMoving': ['moving other team\'s item in Site', -10],
    'Stepping': ['Member Stepping into the Field', -100],
    'Restricted': ['Carrier in Restricted Area (non-E)', -10],
    'RestrictedEng': ['Carrier in Restricted Area (E)', -50],

    'DepSoldier': ['Deploy a Soldier', 5],
    'DepGeneral': ['Deploy a General', 15],
    'RecSoldier': ['Recall a Soldier', -5],
    'RecGeneral': ['Recall a General', -15],

    'NGColored': ['colored zone seedling', 10],
    'NGSide': ['side zone seedling', 20],
    'NGCenter': ['center zone seedling', 30],

    'GColored': ['colored zone seedling', 20],
    'GSide': ['side zone seedling', 40],
    'GCenter': ['center zone seedling', 60],

    'ARRecog': ['recognition', 30],
    'ARGolf': ['golf ball', 50],

    'MinorsVio': ['minor violation', -10],
    'MajorsVio': ['major violation', -30],
}

IP_ADDRESS = "localhost"
# IP_ADDRESS = "10.89.2.208"
