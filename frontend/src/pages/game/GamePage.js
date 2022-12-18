import React from "react";
import Site from "../../components/site/Site";
import ScoreLog from "../../components/socrelog/ScoreLog";
import ServerList from "../../service/utils";
import ReadyIcon from "../../components/ready_icon/ReadyIcon";
import TeamIcon from "../../components/team_icon/TeamIcon";
import teamInfo from "../../assets/teaminfo.json";
import field from "../../assets/field.png";
import {
    CheckCircleOutlined,
    ClockCircleOutlined, CloseCircleOutlined,
    LeftCircleOutlined,
    LoadingOutlined,
    RightCircleOutlined, RightOutlined
} from "@ant-design/icons";
import {Statistic} from 'antd';

import team1 from "../../assets/team1.png";
import team2 from "../../assets/team2.png";
import team3 from "../../assets/team3.png";
import team4 from "../../assets/team4.png";

import './game.css'
import CountBar from "../../components/countdown/CountBar";

const {Countdown} = Statistic;

class GamePage extends React.Component<> {
    ws = new WebSocket(ServerList['view']);

    constructor(props) {
        super(props);
        this.imgSet = [team1, team2, team3, team4];
        this.state = {
            site:
                [
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    }
                ],
            scoreLog: [],
            state: 'None',  // None, Prepare, Game, Start, Settle
            ready: 'None',  // Black, White, None, Both
            whiteID: -1,
            blackID: -1,
            gameTime: 5 * 60,
            gameTimeMS: 5 * 60 * 1000,
            startTime: Date.now(),
            whiteSoldier: 5,
            blackSoldier: 5,
            site0Host: 'None',
            site0Time: 0,
            preStartTimeMs: 3 * 60 * 1000,
            preTime: Date.now(),
        }
        this.ws.onmessage = (m) => {
            if (m.data === "TESTING")
                return
            if (m.data.split('^')[1] === "Score") {
                this.setState({
                    scoreLog: JSON.parse(m.data.split('^')[2])
                })
            } else if (m.data.split('^')[1] === "State") {
                let temp = JSON.parse(m.data.split('^')[2])
                this.setState({
                    state: temp['State'],
                    ready: !(temp['Ready']['Black'] || temp['Ready']['White']) ? 'None' : (temp['Ready']['Black'] && temp['Ready']['White'] ? 'Both' : (temp['Ready']['White'] ? 'White' : 'Black')),
                    whiteID: temp['Team']['White'] - 1,
                    blackID: temp['Team']['Black'] - 1
                })
                if (temp['State'] === 'Start') {
                    this.setState({
                        gameTime: 5 * 60,
                        gameTimeMS: 5 * 60 * 1000,
                        startTime: Date.now(),
                        whiteSoldier: 5,
                        blackSoldier: 5,
                        site0Host: 'None',
                        site0Time: 0,
                    })
                }
                if (temp['State'] === 'PCount' && (!temp['Ready']['Black'] && !temp['Ready']['White'])) {
                    this.setState({
                        preStartTimeMs: 3 * 60 * 1000,
                        preTime: Date.now(),
                    })
                }
            } else if (m.data.split('^')[1] === "Site") {
                let data = JSON.parse(m.data.split('^')[2])
                let newHost = data[0]['Black']===data[0]['White'] ? 'None' : (data[0]['Black'] > data[0]['White'] ? 'Black' : 'White')
                this.setState({
                    site: data,
                })
                if (this.state.site0Host !== newHost)
                    this.setState({
                        site0Host: newHost,
                        site0Time: this.state.gameTime
                    })
            }
        }
    }

    preTimeChange = (time) => {
        if (this.state.preStartTimeMs - time > 30)
            this.setState({
                preStartTimeMs: time,
            })
    }

    timeChange = (time) => {
        if (parseInt(time / 1000) !== this.state.gameTime) {
            if (parseInt(time / 1000) % 30 === 0) {
                this.setState({
                    whiteSoldier: this.state.whiteSoldier + 1,
                    blackSoldier: this.state.blackSoldier + 1
                })
            }
            this.setState({
                gameTime: parseInt(time / 1000)
            })
        }
        if (this.state.gameTimeMS - time > 30) {
            this.setState({
                gameTimeMS: time
            })
        }
        if (this.state.site0Host!=='None' && 60-this.state.site0Time+parseInt(time / 1000) === 0) {
            this.setState({
                site0Time: parseInt(time / 1000)
            })
            this.ws.send("Score^Update^" + this.state.site0Host)
        }
    }

    render() {
        if (this.state.state === 'None')
            return (
                <div>
                    PLEASE RESET THE GAME FIRST
                </div>
            )
        else if (this.state.state === 'Prepare' || this.state.state === 'PCount')
            return (
                <div
                    className={"prepare-main d-flex flex-column justify-content-between align-content-between h-100 w-100 ready-state-" + this.state.ready}>
                    <div className="prepare-main d-flex flex-column justify-content-between align-content-between">
                        <h1 className='text-center' style={{marginTop: 30}}>Preparation Stage</h1>
                        {this.state.state === 'PCount' &&
                            <Countdown valueStyle={{fontSize: 50, textAlign: 'center'}} prefix={<ClockCircleOutlined/>}
                                       title={<h3 className='text-center'>Prepare Time</h3>}
                                       value={this.state.preTime + 3 * 60 * 1000} format="mm:ss"
                                       onChange={this.preTimeChange}/>
                        }
                        {this.state.state === 'PCount' &&
                            <div className='m-auto'>
                            <CountBar backgroundColor={'#69B0AC'} color={'#00896C'} size={700}
                                      curSeconds={this.state.preStartTimeMs / 1000} maxSeconds={3*60} isVertical={false}/>
                            </div>
                        }
                        {this.state.state === 'Prepare' &&
                            <h3 className='text-center' style={{marginTop: 50}}><LoadingOutlined style={{marginRight: 30}}/>Waiting
                                for the command ...</h3>
                        }
                    </div>
                    <div className='d-flex flex-row justify-content-between m-4'>
                        <div>
                            <ReadyIcon teamName={teamInfo[this.state.blackID].name}
                                       teamImage={this.imgSet[this.state.blackID]}
                                       isReady={this.state.ready === 'Black' || this.state.ready === 'Both'}
                                       side={'Black'}/>
                        </div>
                        <div>
                            <img alt={"field"} src={field}
                                 className={'game-prepare-field' + (this.state.ready === 'Both' ? ' game-prepare-ready' : ' game-prepare-not')}/>
                        </div>
                        <div>
                            <ReadyIcon teamName={teamInfo[this.state.whiteID].name}
                                       teamImage={this.imgSet[this.state.whiteID]}
                                       isReady={this.state.ready === 'White' || this.state.ready === 'Both'}
                                       side={'White'}/>
                        </div>
                    </div>
                </div>
            )
        else if (this.state.state === 'Settle') {
            let whiteTotal = this.state.scoreLog.filter(x => x["Side"] === "White").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let blackTotal = this.state.scoreLog.filter(x => x["Side"] === "Black").reduce((a, b) => a + parseInt(b["Score"]), 0)
            return (
                <div className="game-main d-flex flex-column align-content-center"
                     style={{width: '100%', height: '100%'}}>
                    <h1 className='text-center m-5'>Game Settlement <RightOutlined /> Winner: <strong>{whiteTotal < blackTotal ? teamInfo[this.state.blackID].name : (whiteTotal > blackTotal ? teamInfo[this.state.whiteID].name : 'NONE')}</strong></h1>
                    <div className="game-site-log d-flex flex-row justify-content-around">
                        <div className="game-log d-flex flex-column justify-content-center">
                            <div className='text-center w-100' style={{fontSize: 60}}> {whiteTotal < blackTotal ? <CheckCircleOutlined style={{color: '#4CAF50'}}/> : <CloseCircleOutlined style={{color: '#F44336'}}/>} </div>
                            <ReadyIcon teamName={teamInfo[this.state.blackID].name}
                                       teamImage={this.imgSet[this.state.blackID]} display={true}
                                       isReady={whiteTotal < blackTotal} side={'Black'}/>
                            <h2 className='text-center m-2'>Total Score: <strong style={{fontSize: 50}}>{blackTotal}</strong></h2>
                        </div>
                        <div className="game-sites" style={{height: 600, width: 600}}>
                            <div className="d-flex align-content-center flex-row w-100 h-100">
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[1]["White"]}
                                          blackScore={this.state.site[1]["Black"]}/>
                                    <Site size={180} whiteScore={this.state.site[2]["White"]}
                                          blackScore={this.state.site[2]["Black"]}/>
                                </div>
                                <div className="d-flex flex-column justify-content-center w-100 h-100">
                                    <Site size={210} whiteScore={this.state.site[0]["White"]}
                                          blackScore={this.state.site[0]["Black"]}/>
                                </div>
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[3]["White"]}
                                          blackScore={this.state.site[3]["Black"]}/>
                                    <Site size={180} whiteScore={this.state.site[4]["White"]}
                                          blackScore={this.state.site[4]["Black"]}/>
                                </div>
                            </div>
                        </div>
                        <div className="game-log d-flex flex-column">
                            <div className='text-center w-100' style={{fontSize: 60}}> {whiteTotal > blackTotal ? <CheckCircleOutlined style={{color: '#4CAF50'}}/> : <CloseCircleOutlined style={{color: '#F44336'}}/>} </div>
                            <ReadyIcon teamName={teamInfo[this.state.whiteID].name}
                                       teamImage={this.imgSet[this.state.whiteID]} display={true}
                                       isReady={whiteTotal > blackTotal} side={'White'}/>
                            <h2 className='text-center m-2'>Total Score: <strong style={{fontSize: 50}}>{whiteTotal}</strong></h2>
                        </div>
                    </div>
                    <h1 className='text-center m-5'>Please Check and Confirm Your Score Log with the Major Judge</h1>
                </div>
            )
        }else
            return (
                <div className="game-main" style={{width: '100%', height: '100%'}}>
                    <div className='d-flex flex-column game-body'>
                        <div className='d-flex flex-row game-bar justify-content-around m-4'>
                            <TeamIcon side={'Black'} teamName={teamInfo[this.state.blackID].name}
                                      teamImage={this.imgSet[this.state.blackID]}/>
                            {this.state.state === "Start" &&
                                <Countdown valueStyle={{fontSize: 50}} prefix={<ClockCircleOutlined/>}
                                           title={<h3 className='text-center'>Game Time</h3>}
                                           value={this.state.startTime + 5 * 60 * 1000} format="mm:ss"
                                           onChange={this.timeChange}/>}
                            <TeamIcon side={'White'} teamName={teamInfo[this.state.whiteID].name}
                                      teamImage={this.imgSet[this.state.whiteID]}/>
                        </div>
                        <div className="game-site-log d-flex flex-row justify-content-around">
                            <div className="game-log d-flex">
                                <ScoreLog width={500} height={680} side={"Black"}
                                          data={this.state.scoreLog.filter(x => x["Side"] === "Black")}/>
                            </div>
                            <CountBar backgroundColor={'#69B0AC'} color={'#00896C'} size={500}
                                      curSeconds={(this.state.gameTimeMS%(1000*30)) / 1000} maxSeconds={30} isVertical={true}/>
                            <div className="game-sites" style={{height: 600, width: 680}}>
                                <div className="d-flex align-content-center flex-row w-100 h-100">
                                    <div className="d-flex flex-column justify-content-between w-100 h-100">
                                        <Site size={180} whiteScore={this.state.site[1]["White"]}
                                              blackScore={this.state.site[1]["Black"]}/>
                                        <Site size={180} whiteScore={this.state.site[2]["White"]}
                                              blackScore={this.state.site[2]["Black"]}/>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center w-100 h-100">
                                        <Site size={210} whiteScore={this.state.site[0]["White"]}
                                              blackScore={this.state.site[0]["Black"]}/>
                                        <CountBar backgroundColor={'#f0f0f0'} color={this.state.site0Host==='White' ? "#7DB9DE" : this.state.site0Host==='Black' ? "#005CAF" : "#f0f0f0"} size={190}
                                                  curSeconds={this.state.site0Host==='None'?60:(60-this.state.site0Time+this.state.gameTime)} maxSeconds={60} isVertical={false}/>
                                    </div>
                                    <div className="d-flex flex-column justify-content-between w-100 h-100">
                                        <Site size={180} whiteScore={this.state.site[3]["White"]}
                                              blackScore={this.state.site[3]["Black"]}/>
                                        <Site size={180} whiteScore={this.state.site[4]["White"]}
                                              blackScore={this.state.site[4]["Black"]}/>
                                    </div>
                                </div>
                            </div>
                            <CountBar backgroundColor={'#69B0AC'} color={'#00896C'} size={500}
                                      curSeconds={(this.state.gameTimeMS%(1000*30)) / 1000} maxSeconds={30} isVertical={true}/>
                            <div className="game-log d-flex">
                                <ScoreLog width={500} height={680} side={"White"}
                                          data={this.state.scoreLog.filter(x => x["Side"] === "White")}/>
                            </div>
                        </div>
                        <div className='d-flex flex-row game-bottom justify-content-around m-2'>
                            <div>
                                <Statistic title="Soldier Generated" suffix={<LeftCircleOutlined style={{marginLeft: 10}}/>}
                                           prefix={<RightCircleOutlined style={{marginRight: 10}}/>} value={this.state.blackSoldier}
                                           valueStyle={{textAlign: 'center', fontSize: 35}}/>
                            </div>
                            <div className='d-flex flex-column'>
                                <h3 className='text-center'><LoadingOutlined
                                    style={{marginRight: 15}}/>{this.state.gameTime % 60 > 20 ? 'Engineer Working in Progress' : 'Battle Lab Refilling'}
                                </h3>
                                <CountBar backgroundColor={this.state.gameTime % 60 > 20 ? '#DC9FB4' : '#B5CAA0'}
                                          color={this.state.gameTime % 60 > 20 ? '#E83015' : '#91AD70'} size={500}
                                          curSeconds={this.state.gameTime % 60 > 20 ? (this.state.gameTimeMS % (60 * 1000)) / 1000 - 20 : (this.state.gameTimeMS % (60 * 1000)) / 1000}
                                          maxSeconds={this.state.gameTime % 60 > 20 ? 40 : 20} isVertical={false}/>
                            </div>
                            <div>
                                <Statistic title="Soldier Generated" suffix={<LeftCircleOutlined style={{marginLeft: 10}}/>}
                                           prefix={<RightCircleOutlined style={{marginRight: 10}}/>} value={this.state.whiteSoldier}
                                           valueStyle={{textAlign: 'center', fontSize: 35}}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}

export default GamePage