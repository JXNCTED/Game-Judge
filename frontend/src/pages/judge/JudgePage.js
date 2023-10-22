import React from "react";
import JudgeButton from "../../components/judge_button/JudgeButton";
import {Button, Card, message, Modal} from "antd";
import ListGroup from "react-bootstrap/ListGroup";
import ScoreLog from "../../components/socrelog/ScoreLog";
import ServerList from "../../service/utils";

// const buttonList = {
// reward button
// 'Wiring': ['Time-limited Welding Challenge', 15],
// 'StayRampS': ['Carrier Staying on the Ramp', 15],
// 'DepSoldier': ['Deploy a Soldier', 5],
// 'DepGeneral': ['Deploy a General', 10],
// 'Occupy': ['Occupy One Site', 80],


// penalty button list
//     'CrashWall': ['Carrier Stepping over the Wall', -3],
//     'Bomb': ['Engineer Taking out a Bomb', -20],
//     'CarrierOut': ['Carrier Going Out of the Field', -10],
//     'DBlocking': ['Striking or blocking the opponent', -20],
//     'DMoving': ['moving other team\'s item in Site', -10],
//     'Stepping': ['Member Stepping into the Field', -100],
//     'Restricted': ['Carrier in Restricted Area (non-E)', -10],
//     'RestrictedEng': ['Carrier in Restricted Area (E)', -50],
// }

const ngRewardButton = {
    'NGColored': ['colored zone seedling', 10],
    'NGSide': ['side zone seedling', 20],
    'NGCenter': ['center zone seedling', 30],
}
const gRewardButton = {
    'GColored': ['colored zone seedling', 20],
    'GSide': ['side zone seedling', 40],
    'GCenter': ['center zone seedling', 60],
}

const arRewardButton = {
    'ARRecog': ['recognition', 30],
    'ARGolf': ['golf ball', 50],
}

const penaltyButtonList = {
    'MinorsVio': ['minor violation', -10],
    'MajorsVio': ['major violation', -30],
}


// const siteList = {
//     'DepSoldier': ['Deploy a Soldier', 5, 101, 'Soldier'],
//     'DepGeneral': ['Deploy a General', 15, 102, 'General'],
//     'RecSoldier': ['Recall a Soldier', -5, 201, 'Soldier'],
//     'RecGeneral': ['Recall a General', -15, 202, 'General'],
// }

class GamePage extends React.Component<> {
    constructor(props) {
        super(props);
        // this.numButtons = Object.keys(buttoncList).length;
        this.numButtons = Object.keys(ngRewardButton).length + Object.keys(gRewardButton).length + Object.keys(arRewardButton).length + Object.keys(penaltyButtonList).length;
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
                this.onLogLoad()
                setTimeout(() => {
                    this.onLoaded(this.state.requestingIndex)
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
            requestingIndex: this.numButtons - 1
        })
        this.ws.send("Admin^Ready")
        setTimeout(() => {
            if (this.state.requestingIndex === this.numButtons - 1) {
                message.error('Set to Ready Timeout!')
                this.onLoaded()
            }
        }, 5000);
    }

    // onSiteClicked = (site) => {
    //     let index = this.state.popupIndex
    //     let key = Object.keys(siteList)[index]
    //     this.setState({popupIndex: -1})
    //     this.onClicked(siteList[key][2], key)
    //     setTimeout(() => {
    //         this.ws.send(`Site^${siteList[key][1]>0?'Add':'Remove'}^${this.props.side}+${site}+${siteList[key][3]}`)
    //     }, 500);
    // }

    render() {
        return (<div className="judge-main">
            <Modal title="Select Site" open={this.state.popupIndex >= 0}
                   onCancel={() => this.setState({popupIndex: -1})} footer={null} width={800}>
                <h2>BE CAREFUL WHEN YOU SELECT THE SITE</h2>
                <h4>The consequences of a mistaken choice can be <strong>irreparable</strong></h4>
                <div className='d-flex flex-row justify-content-around'>
                    {[...Array(5).keys()].map((i) => {
                        return <Button style={{width: 120}} className='m-2' size='large' key={i}
                                       onClick={() => this.onSiteClicked(i)}
                                       type='primary'>Site-<strong>{i}</strong></Button>
                    })}
                </div>
            </Modal>
            <div className="judge-buttons">
                <div className="d-flex align-content-center flex-row w-100 h-100 flex-fill">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <Card size='small' className="m-2" title={<h4>Reward</h4>} style={{width: 370}}>
                                <ListGroup className={'list-group-flush'}>
                                    <ListGroup.Item>
                                        <div className="d-flex flex-column">
                                            {Object.keys(ngRewardButton).map((key, index) => {
                                                return (<div className="m-2">
                                                    <JudgeButton disabled={false}
                                                                 isLoading={this.state.isLoading}
                                                                 description={ngRewardButton[key][0]} isDeduct={false}
                                                                 score={ngRewardButton[key][1]}
                                                                 variant={"success"} // make it green
                                                                 onClick={() => this.onClicked(index, key)
                                                                 }/>
                                                </div>)
                                            })}
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex flex-column">
                                            {Object.keys(gRewardButton).map((key, index) => {
                                                return (<div className="m-2">
                                                    <JudgeButton disabled={false}
                                                                 isLoading={this.state.isLoading}
                                                                 description={gRewardButton[key][0]} isDeduct={false}
                                                                 score={gRewardButton[key][1]}
                                                                 variant={"warning"} // make it yellow
                                                                 onClick={() => this.onClicked(index, key)}/>
                                                </div>)
                                            })}
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>
                        <div className="d-flex flex-column">
                            <Card size='small' className="m-2" title={<h4>Preparation</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    <Button type='primary' className='m-3' size='large'
                                            loading={this.state.requestingIndex === this.numButtons - 1}
                                            onClick={() => this.onTeamReady()}>
                                        {this.props.side} Team Ready!
                                    </Button>
                                </div>
                            </Card>
                            <Card size='small' className="m-2" title={<h4>Penalty</h4>} style={{width: 370}}>
                                <div className="d-flex flex-column">
                                    {Object.keys(penaltyButtonList).map((key, index) => {
                                        return (<div className="m-2">
                                            <JudgeButton disabled={false}
                                                         isLoading={this.state.isLoading}
                                                         description={penaltyButtonList[key][0]} isDeduct={true}
                                                         score={-penaltyButtonList[key][1]}
                                                         variant={"danger"} // make it red
                                                         onClick={() => this.onClicked(index, key)}/>
                                        </div>)
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