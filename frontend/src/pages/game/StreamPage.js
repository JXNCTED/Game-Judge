import React from "react";
import Site from "../../components/site/Site";
import ScoreLog from "../../components/socrelog/ScoreLog";
import Coundtdown from "../../components/countdown/Countdown";
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
import { Statistic } from 'antd';

import team1 from "../../assets/team1.png";
import team2 from "../../assets/team2.png";
import team3 from "../../assets/team3.png";
import team4 from "../../assets/team4.png";

import styles from './stream.module.css'
import CountBar from "../../components/countdown/CountBar";

const { Countdown } = Statistic;

class StreamPage extends React.Component<> {
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
            prepTime: 3 * 60,
            prepStartTime: Date.now(),
            gameTimeMS: 5 * 60 * 1000,
            startTime: Date.now(),
            whiteSoldier: 5,
            blackSoldier: 5,
            site0Host: 'None',
            site0Time: 0,
            numPages: null,
            pageNumber: 1,
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
                if (temp['State'] === 'Prepare') {
                    this.setState({
                        prepTime: 5 * 60,
                        prepStartTime: Date.now(),
                    })
                }
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
            } else if (m.data.split('^')[1] === "Site") {
                let data = JSON.parse(m.data.split('^')[2])
                let newHost = data[0]['Black'] === data[0]['White'] ? 'None' : (data[0]['Black'] > data[0]['White'] ? 'Black' : 'White')
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

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    timeChange = (time) => {
        if (this.state.state === "Start") {
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
        } else if (this.state.state === "Prepare") {
            this.setState({
                prepTime: parseInt(time / 1000)
            })
        }

    }

    render() {
        const { pageNumber, numPages } = this.state;
        if (this.state.state === 'None')
            return (
                <div>
                    PLEASE RESET THE GAME FIRST
                </div>
            )
        else if (this.state.state === 'Prepare')
            return (
                <div style={{ paddingTop: 0 }}>

                    <div className={styles.intro}>
                        <div className="d-flex flex-row justify-content-center" style={
                            { paddingTop: 190}
                    
                        }>

                        </div>

                        <div className="d-flex flex-row justify-content-center cameraOutput" style={{ paddingTop: 100, marginLeft: 15}}>
                            <div style={{ backgroundColor: "#00FF00", width: 500, height: 430, marginRight: 16 }}></div>
                            <CountBar backgroundColor={'#f0f0f0'} color={"#4040F0"} size={420}
                                curSeconds={this.state.prepTime} maxSeconds={180} isVertical={true} />
                            <div style={{ backgroundColor: "#00FF00", width: 500, height: 430, marginLeft: 16 }}></div>
                        </div>

                        <div className="d-flex flex-row justify-content-center" style={{ paddingTop: 40 , marginLeft: 26}}>
                            <div className="d-flex flex-row justify-content-center align-items-center" style={{ backgroundColor: "#FFFFFF", width: 200, height: 90, borderRadius: 20 }}>
                                <Countdown title="" valueStyle={{ fontSize: 60 }} value={this.state.prepStartTime + 180 * 1000} format="mm:ss" onChange={this.timeChange} />
                            </div>
                        </div>
                    </div>


                </div>
            )
        else if (this.state.state === 'Settle') {
            let whiteTotal = this.state.scoreLog.filter(x => x["Side"] === "White").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let blackTotal = this.state.scoreLog.filter(x => x["Side"] === "Black").reduce((a, b) => a + parseInt(b["Score"]), 0)
            return (
                <div className="game-main d-flex flex-column align-content-center"
                    style={{ width: '100%', height: '100%' }}>
                    <h1 className='text-center m-5'>Game Settlement <RightOutlined /> Winner: <strong>{whiteTotal < blackTotal ? teamInfo[this.state.blackID].name : (whiteTotal > blackTotal ? teamInfo[this.state.whiteID].name : 'NONE')}</strong></h1>
                    <div className="game-site-log d-flex flex-row justify-content-around">
                        <div className="game-log d-flex flex-column justify-content-center">
                            <div className='text-center w-100' style={{ fontSize: 60 }}> {whiteTotal < blackTotal ? <CheckCircleOutlined style={{ color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ color: '#F44336' }} />} </div>
                            <ReadyIcon teamName={teamInfo[this.state.blackID].name}
                                teamImage={this.imgSet[this.state.blackID]} display={true}
                                isReady={whiteTotal < blackTotal} side={'Black'} />
                            <h2 className='text-center m-2'>Total Score: <strong style={{ fontSize: 50 }}>{blackTotal}</strong></h2>
                        </div>
                        <div className="game-sites" style={{ height: 600, width: 600 }}>
                            <div className="d-flex align-content-center flex-row w-100 h-100">
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[1]["White"]}
                                        blackScore={this.state.site[1]["Black"]} />
                                    <Site size={180} whiteScore={this.state.site[2]["White"]}
                                        blackScore={this.state.site[2]["Black"]} />
                                </div>
                                <div className="d-flex flex-column justify-content-center w-100 h-100">
                                    <Site size={210} whiteScore={this.state.site[0]["White"]}
                                        blackScore={this.state.site[0]["Black"]} />
                                </div>
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[3]["White"]}
                                        blackScore={this.state.site[3]["Black"]} />
                                    <Site size={180} whiteScore={this.state.site[4]["White"]}
                                        blackScore={this.state.site[4]["Black"]} />
                                </div>
                            </div>
                        </div>
                        <div className="game-log d-flex flex-column">
                            <div className='text-center w-100' style={{ fontSize: 60 }}> {whiteTotal > blackTotal ? <CheckCircleOutlined style={{ color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ color: '#F44336' }} />} </div>
                            <ReadyIcon teamName={teamInfo[this.state.whiteID].name}
                                teamImage={this.imgSet[this.state.whiteID]} display={true}
                                isReady={whiteTotal > blackTotal} side={'White'} />
                            <h2 className='text-center m-2'>Total Score: <strong style={{ fontSize: 50 }}>{whiteTotal}</strong></h2>
                        </div>
                    </div>
                    <h1 className='text-center m-5'>Please Check and Confirm Your Score Log with the Major Judge</h1>
                </div>
            )
        } else // in game
        {
            let whiteTotal = this.state.scoreLog.filter(x => x["Side"] === "White").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let blackTotal = this.state.scoreLog.filter(x => x["Side"] === "Black").reduce((a, b) => a + parseInt(b["Score"]), 0)
            console.log(this.state.gameTime)
            return (
                <div className="game-main" style={{ width: '100%', height: '100%', backgroundColor: "#00FF00", paddingTop: 10 }}>

                    <div className='d-flex flex-row justify-content-between m-3 first-row'>

                        <div className="d-flex flex-column justify-content-start align-items-center">
                            <TeamIcon side={'Black'} teamName={teamInfo[this.state.blackID].name}
                                teamImage={this.imgSet[this.state.blackID]} />

                            <Statistic style={{ marginLeft: 10, marginTop: 10 }} suffix={<LeftCircleOutlined style={{ marginLeft: 10 }} />}
                                prefix={<RightCircleOutlined style={{ marginRight: 10 }} />} value={whiteTotal}
                                valueStyle={{ textAlign: 'center', fontSize: 35 }} />

                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center title">

                            <h3> RM2023 Internal Competition Match -</h3>

                            {this.state.state === "Start" && <Countdown title="" valueStyle={{ fontSize: 30 }} value={this.state.startTime + 300 * 1000} onChange={this.timeChange} format="mm:ss" />}
                            {this.state.state === "Game" && <div style={{ fontSize: 30 }}>05:00</div>}

                            <CountBar backgroundColor={'#f0f0f0'} color={"#0F2F89"} size={900}
                                curSeconds={this.state.gameTime} maxSeconds={300} isVertical={false} />

                            <div className='d-flex flex-row justify-content-around w-100' style={{ paddingTop: 20 }}>
                                <Site size={100} whiteScore={this.state.site[1]["White"]}
                                    blackScore={this.state.site[1]["Black"]} />
                                <Site size={100} whiteScore={this.state.site[2]["White"]}
                                    blackScore={this.state.site[2]["Black"]} />
                                <Site size={140} whiteScore={this.state.site[0]["White"]}
                                    blackScore={this.state.site[0]["Black"]} />
                                <Site size={100} whiteScore={this.state.site[3]["White"]}
                                    blackScore={this.state.site[3]["Black"]} />
                                <Site size={100} whiteScore={this.state.site[4]["White"]}
                                    blackScore={this.state.site[4]["Black"]} />

                            </div>

                        </div>


                        <div className="d-flex flex-column justify-content-start align-items-center">
                            <TeamIcon side={'White'} teamName={teamInfo[this.state.whiteID].name}
                                teamImage={this.imgSet[this.state.whiteID]} />

                            <Statistic style={{ marginRight: 10, marginTop: 10 }} suffix={<LeftCircleOutlined style={{ marginLeft: 10 }} />}
                                prefix={<RightCircleOutlined style={{ marginRight: 10 }} />} value={blackTotal}
                                valueStyle={{ textAlign: 'center', fontSize: 35 }} />
                        </div>

                    </div>

                    {/* <div className='d-flex flex-column game-body'>

                        <div className='d-flex flex-row game-bottom justify-content-around m-2'>

                            <div className='d-flex flex-column'>
                                <h3 className='text-center'><LoadingOutlined
                                    style={{ marginRight: 15 }} />{this.state.gameTime % 60 > 20 ? 'Engineer Working in Progress' : 'Battle Lab Refilling'}
                                </h3>
                                <CountBar backgroundColor={this.state.gameTime % 60 > 20 ? '#DC9FB4' : '#B5CAA0'}
                                    color={this.state.gameTime % 60 > 20 ? '#E83015' : '#91AD70'} size={500}
                                    curSeconds={this.state.gameTime % 60 > 20 ? (this.state.gameTimeMS % (60 * 1000)) / 1000 - 20 : (this.state.gameTimeMS % (60 * 1000)) / 1000}
                                    maxSeconds={this.state.gameTime % 60 > 20 ? 40 : 20} isVertical={false} />
                            </div>

                        </div>

                    </div> */}

                </div>
            )
        }
    }


}

const stylesO = {
    rectangle: {
        width: '300px',
        height: '300px',
        color: "#00FF00"
    }
}

export default StreamPage