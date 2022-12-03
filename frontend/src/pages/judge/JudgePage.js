import React from "react";
import JudgeButton from "../../components/judge_button/JudgeButton";
import {Button, Card, message} from "antd";
import ScoreLog from "../../components/socrelog/ScoreLog";

const buttonList = {
    'StayRampS': ['Carrier Staying on the Ramp', 10],
    'DepSoldier': ['Deploy a Soldier', 5],
    'DepGeneral': ['Deploy a General', 10],
    'OccupyZero': ['Occupying Site 0 for 1 minute', 20],
    'StayRampE': ['Stay on the ramp', 15],
    'Occupy': ['Occupy One Site', 80],

    'FailStayRampS': ['Carrier Not Staying on the Ramp', -20],
    'PauseOne': ['Technical Pause for 1 min', -10],
    'CrashWall': ['Carrier Stepping over the Wall', -3],
    'Bomb': ['Engineer Taking out a Bomb', -30],
    'CarrierOut': ['Carrier Going Out of the Field', -30],
    'DBlocking': ['Striking or blocking the opponent', -20],
    'DMoving': ['moving other team\'s item in Site', -30],
    'Stepping': ['Member Stepping into the Field', -100],
    'Restricted': ['Carrier in the Restricted Area', -30],
}

class GamePage extends React.Component<> {
    constructor(props) {
        super(props);
        this.numButtons = Object.keys(buttonList).length;
        this.state = {
            isLoadings: Array.from({length: this.numButtons}, () => false),
            isDsiableds: Array.from({length: this.numButtons}, () => false),
            number: 1,
            requestingIndex: -1,
            logLoading: false,
            logData: [],
        }
        this.ws = new WebSocket("ws://localhost:"+(props.side==='Black'?'2222':'3333'))
        this.ws.onmessage = (m) => {
            if (m.data.split('^')[0] === "Ack") {
                if (m.data.split('^')[1] === "Success") {
                    message.success(m.data.split('^')[2]+' Acknowledged')
                }
                else {
                    message.error('Invalid Request')
                }
                setTimeout(() => {
                    this.onLoaded(this.state.requestingIndex)
                    this.onLogLoad()
                }, 1000);
            }
            else if (m.data.split('^')[0] === "Response") {
                this.setState({
                    logLoading: false,
                    logData: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))
                })
            }
        }
        this.ws.onopen = () => {
            this.onLogLoad()
        }
    }

    onLoaded(index) {
        const {isLoadings, isDsiableds} = this.state;
        if (this.state.requestingIndex !== -1) isLoadings[index] = false;

        // wake all other buttons up
        for (let i = 0; i < this.numButtons; i++) {
            isDsiableds[i] = false;
        }
        this.setState({isLoadings: isLoadings, isDsiableds: isDsiableds, requestingIndex: -1});
    }

    onClicked(index, name) {

        const {isLoadings, isDsiableds} = this.state;

        // only take reaction if not disabled or loading
        if (isDsiableds[index] === true || isLoadings[index] === true) return;
        isLoadings[index] = true;
        // if operation succeeds, set all other buttons as disabled
        for (let i = 0; i < this.numButtons; i++) {
            isDsiableds[i] = i !== index;
        }
        this.setState({isLoadings: isLoadings, isDsiableds: isDsiableds, requestingIndex: index})
        this.ws.send("Score^Update^" + name)
        setTimeout(() => {
            if (this.state.requestingIndex === index) {
                message.error(name + ' Timeout')
                this.onLoaded(index)
            }
        }, 10000);
    }

    onLogLoad() {
        this.setState({
            logLoading: true,
        })
        this.ws.send("Request^Score")
    }

    render() {
        return (<div className="judge-main">
            <div className="judge-buttons">
                <div className="d-flex align-content-center flex-row w-100 h-100 flex-fill">
                    <div className="d-flex flex-row">
                        <Card className="m-2" title={<h2>Reward</h2>} style={{width: 400}}>
                            <div className="d-flex flex-column">
                                {Object.keys(buttonList).map((key, index) => {
                                    if (buttonList[key][1] > 0) return (<div className="m-2">
                                        <JudgeButton disabled={this.state.isDsiableds[index]}
                                                     isLoading={this.state.isLoadings[index]}
                                                     description={buttonList[key][0]} isDeduct={false}
                                                     score={buttonList[key][1]}
                                                     onClick={() => this.onClicked(index, key)}/>
                                    </div>)
                                    else return null
                                })}
                            </div>
                        </Card>
                        <Card className="m-2" title={<h2>Penalty</h2>} style={{width: 400}}>
                            <div className="d-flex flex-column">
                                {Object.keys(buttonList).map((key, index) => {
                                    if (buttonList[key][1] < 0) return (<div className="m-2">
                                        <JudgeButton disabled={this.state.isDsiableds[index]}
                                                     isLoading={this.state.isLoadings[index]}
                                                     description={buttonList[key][0]} isDeduct={true}
                                                     score={-buttonList[key][1]}
                                                     onClick={() => this.onClicked(index, key)}/>
                                    </div>)
                                    else return null
                                })}
                            </div>
                        </Card>
                    </div>
                    <div className='m-2 d-flex flex-column'>
                        <Button type={'primary'} className='m-3' size='large' loading={this.state.logLoading} onClick={() => this.onLogLoad()}>
                            Load Newest Log
                        </Button>
                        <ScoreLog side={this.props.side} data={this.state.logData}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default GamePage