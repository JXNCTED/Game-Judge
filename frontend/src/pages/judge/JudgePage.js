import React from "react";
import JudgeButton from "../../components/judge_button/JudgeButton";
import {Button, Card, message, Modal} from "antd";
import ScoreLog from "../../components/socrelog/ScoreLog";
import ServerList from "../../service/utils";

const buttonList = {
    'StayRampS': ['Carrier Staying on the Ramp', 10],
    // 'DepSoldier': ['Deploy a Soldier', 5],
    // 'DepGeneral': ['Deploy a General', 10],
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

const siteList = {
    'DepSoldier': ['Deploy a Soldier', 5, 101],
    'DepGeneral': ['Deploy a General', 10, 102],
    'RecSoldier': ['Recall a Soldier', -5, 201],
    'RecGeneral': ['Recall a General', -10, 202],
}

class GamePage extends React.Component<> {
    constructor(props) {
        super(props);
        this.numButtons = Object.keys(buttonList).length;
        this.state = {
            isLoading: false,
            requestingIndex: -1,
            logLoading: false,
            logData: [],
            popupIndex: -1,
        }
        this.ws = new WebSocket(props.side === 'Black' ? ServerList['judge-b'] : ServerList['judge-w'])
        this.ws.onmessage = (m) => {
            if (m.data.split('^')[0] === "Ack") {
                if (m.data.split('^')[1] === "Success") {
                    message.success(m.data.split('^')[2] + ' Acknowledged')
                } else {
                    message.error('Invalid Request')
                }
                setTimeout(() => {
                    this.onLoaded(this.state.requestingIndex)
                    this.onLogLoad()
                }, 1000);
            } else if (m.data.split('^')[0] === "Response") {
                this.setState({
                    logLoading: false,
                    logData: JSON.parse(m.data.split('^')[2])
                })
            }
        }
        this.ws.onopen = () => {
            this.onLogLoad()
        }
    }

    onLoaded() {
        this.setState({
            isLoading: false,
            requestingIndex: -1,
        })
    }

    onClicked(index, name) {
        this.setState({isLoading: true, requestingIndex: index})
        this.ws.send("Score^Update^" + name)
        setTimeout(() => {
            if (this.state.requestingIndex === index) {
                message.error(name + ' Timeout')
                this.onLoaded()
            }
        }, 5000);
    }

    onLogLoad() {
        this.setState({
            logLoading: true,
        })
        this.ws.send("Request^Score")
    }

    onTeamReady() {
        this.setState({
            isLoading: true,
            requestingIndex: this.numButtons-1
        })
        this.ws.send("Admin^Ready")
        setTimeout(() => {
            if (this.state.requestingIndex === this.numButtons-1) {
                message.error('Set to Ready Timeout!')
                this.onLoaded()
            }
        }, 5000);
    }

    onSiteClicked = (site) => {
        let index = this.state.popupIndex
        let key = Object.keys(siteList)[index]
        this.setState({popupIndex: -1})
        this.onClicked(siteList[key][2], key)
    }

    render() {
        return (<div className="judge-main">
            <Modal title="Select Site" open={this.state.popupIndex >= 0} onCancel={()=>this.setState({popupIndex: -1})} footer={null} width={800}>
                <h2>BE CAREFUL WHEN YOU SELECT THE SITE</h2>
                <h4>The consequences of a mistaken choice can be <strong>irreparable</strong></h4>
                <div className='d-flex flex-row justify-content-around'>
                    {[...Array(5).keys()].map((i) => {
                        return <Button style={{width: 120}} className='m-2' size='large' key={i} onClick={()=>this.onSiteClicked(i)} type='primary'>Site-<strong>{i}</strong></Button>
                    })}
                </div>
            </Modal>
            <div className="judge-buttons">
                <div className="d-flex align-content-center flex-row w-100 h-100 flex-fill">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <Card size='small' className="m-2" title={<h4>Reward</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    {Object.keys(buttonList).map((key, index) => {
                                        if (buttonList[key][1] > 0) return (<div className="m-2">
                                            <JudgeButton disabled={false}
                                                         isLoading={this.state.isLoading}
                                                         description={buttonList[key][0]} isDeduct={false}
                                                         score={buttonList[key][1]}
                                                         onClick={() => this.onClicked(index, key)}/>
                                        </div>)
                                        else return null
                                    })}
                                </div>
                            </Card>
                            <Card size='small' className="m-2" title={<h4>Site</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    {Object.keys(siteList).map((key, index) => {
                                        return (
                                            <div className="m-2">
                                                <JudgeButton disabled={false}
                                                             isLoading={this.state.isLoading}
                                                             description={siteList[key][0]} isDeduct={siteList[key][1] < 0}
                                                             score={Math.abs(siteList[key][1])}
                                                             onClick={() => this.setState({popupIndex: index})}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </div>
                        <div className="d-flex flex-column">
                            <Card size='small' className="m-2" title={<h4>Preparation</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    <Button type='primary' className='m-3' size='large' loading={this.state.requestingIndex === this.numButtons-1}
                                            onClick={() => this.onTeamReady()}>
                                        {this.props.side} Team Ready!
                                    </Button>
                                </div>
                            </Card>
                            <Card size='small' className="m-2" title={<h4>Penalty</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    {Object.keys(buttonList).map((key, index) => {
                                        if (buttonList[key][1] < 0) return (<div className="m-2">
                                            <JudgeButton disabled={false}
                                                         isLoading={this.state.isLoading}
                                                         description={buttonList[key][0]} isDeduct={true}
                                                         score={-buttonList[key][1]}
                                                         onClick={() => this.onClicked(index, key)}/>
                                        </div>)
                                        else return null
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className='m-2 d-flex flex-column'>
                        <Button type={'primary'} className='m-3' size='large' loading={this.state.logLoading}
                                onClick={() => this.onLogLoad()}>
                            Load Newest Log
                        </Button>
                        <ScoreLog side={this.props.side} data={this.state.logData}/>
                    </div>
                </div>
            </div>
        </div>)

    }
}

export default GamePage