import React from "react";
import Site from "../../components/site/Site";
import ServerList from "../../service/utils";
import teamInfo from "../../assets/teaminfo.json";
import {
    LeftCircleOutlined,
    RightCircleOutlined
} from "@ant-design/icons";
import { Statistic } from 'antd';

import team1 from "../../assets/team1.png";
import team2 from "../../assets/team2.png";
import team3 from "../../assets/team3.png";
import team4 from "../../assets/team4.png";
import loading from "../../assets/loading.png";

import styles from './stream.module.css'
import CountBar from "../../components/countdown/CountBar";
import GifEffect from "../../components/effect/GifEffect";
import PngEffect from "../../components/effect/PngEffect";

import engineerShutdown from "../../assets/engineerShutdown.png";
import engineerWakeup from "../../assets/engineerWakeup.png";
import explode from "../../assets/explode1.gif";

import blackVictory from "../../assets/blackVictory.png";
import whiteVictory from "../../assets/whiteVictory.png";
import gameFinish from "../../assets/gameFinish.png";
import scoreTie from "../../assets/scoreTie.png";
import TeamIcon from "../../components/team_icon/TeamIcon";

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
            preStartTimeMs: 3 * 60,
            prepStartTime: Date.now(),
            gameTimeMS: 5 * 60 * 1000,
            startTime: Date.now(),
            whiteSoldier: 5,
            blackSoldier: 5,
            site0Host: 'None',
            site0Time: 0,
            numPages: null,
            pageNumber: 1,

            // icon states
            engineerShutdownVisible: false,
            whiteBomb: 0,
            blackBomb: 0,

            // engineer state transition times
            shutdownTimes: [300 - 40, 300 - (40 + 60), 300 - (40 + 60 * 2), 300 - (40 + 60 * 3)],
            wakeupTimes: [300 - 60, 300 - 60 * 2, 300 - 60 * 3, 300 - 60 * 4],
        }

        this.ws.onmessage = (m) => {

            console.log("data received:", JSON.parse(m.data.split('^')[2]))
            // console.log("data type:",typeof(JSON.parse(m.data.split('^')[2])))
            // console.log("data len:",JSON.parse(m.data.split('^')[2]).length)

            let len = JSON.parse(m.data.split('^')[2]).length

            if ((JSON.parse(m.data.split('^')[2]))[len - 1] !== undefined && (JSON.parse(m.data.split('^')[2]))[len - 1]["Event"] !== undefined) {
                // console.log("here:", (JSON.parse(m.data.split('^')[2]))[len-1]['Event'])
                if ((JSON.parse(m.data.split('^')[2]))[len - 1]['Event'].includes("a Bomb")) {
                    console.log((JSON.parse(m.data.split('^')[2]))[len - 1]["Side"], "Bomb explode!")

                    const { blackBomb, whiteBomb } = this.state
                    if ((JSON.parse(m.data.split('^')[2]))[len - 1]["Side"] === "Black") {
                        this.setState({ blackBomb: blackBomb + 1 })
                    } else {
                        this.setState({ whiteBomb: whiteBomb + 1 })
                    }
                }
            }
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
                if (temp['State'] === 'PCount' && (!temp['Ready']['Black'] && !temp['Ready']['White'])) {
                    this.setState({
                        // prepTime: 5 * 60,
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

                // engineer wake-up/shutdown logics
                if (this.state.shutdownTimes.includes(parseInt(time / 1000))) {
                    this.setState({ engineerShutdownVisible: true })
                } else if (this.state.wakeupTimes.includes(parseInt(time / 1000))) {
                    this.setState({ engineerShutdownVisible: false })
                }

                // debug explosion
                // console.log("bomb", this.state.blackBomb)
                // if (parseInt(time / 1000) % 5 === 0) {
                //     let setValue = !this.state.blackBomb
                //     this.setState({ blackBomb: setValue, whiteBomb: setValue })
                // }

                this.setState({
                    gameTime: parseInt(time / 1000)
                })
            }
            if (this.state.gameTimeMS - time > 30) {
                this.setState({
                    gameTimeMS: time
                })
            }


        } else if (this.state.state === "PCount") {
            this.setState({
                preStartTimeMs: time
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
        else if (this.state.state === 'Prepare' || this.state.state === 'PCount'){
            let whiteReady = this.state.ready === 'White' || this.state.ready === 'Both'
            let blackReady = this.state.ready === 'Black' || this.state.ready === 'Both'
            return (
                <div style={{ paddingTop: 0, backgroundColor: '#00ff00' }}>
                    <div className={styles.intro}>
                        <div className="d-flex flex-column justify-content-end align-items-center w-100 h-100" >
                            <div className='d-flex flex-row justify-content-between' style={{width: '80%'}}>
                                <TeamIcon side={'Black'} teamName={blackReady ? `${teamInfo[this.state.blackID].name} READY` : 'Preparing...'}
                                          teamImage={blackReady ? this.imgSet[this.state.blackID] : loading}/>
                                <TeamIcon side={'White'} teamName={whiteReady ? `${teamInfo[this.state.whiteID].name} READY` : 'Preparing...'}
                                          teamImage={whiteReady ? this.imgSet[this.state.whiteID] : loading}/>
                            </div>
                            {this.state.state === 'PCount' &&
                                <div className="d-flex flex-row justify-content-center" style={{ backgroundColor: "#FFFFFF", width: 200, height: 90, borderRadius: 20 }}>
                                    <Countdown title="" valueStyle={{fontSize: 60}}
                                            value={this.state.prepStartTime + 180 * 1000} format="mm:ss"
                                            onChange={this.timeChange}/>
                                </div>
                            }
                            {this.state.state === 'PCount' &&
                            <CountBar backgroundColor={'#A5DEE4'} color={'#0089A7'} size={700}
                                      curSeconds={this.state.preStartTimeMs / 1000} maxSeconds={3*60} isVertical={false}/>
                            }
                        </div>
                    </div>


                </div>
            )
        }else if (this.state.state === 'Settle') {
            let whiteTotal = this.state.scoreLog.filter(x => x["Side"] === "White").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let blackTotal = this.state.scoreLog.filter(x => x["Side"] === "Black").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let siteSize = 140;
            return (
                <div className="game-main d-flex flex-column align-items-center"
                    style={{ width: '100%', height: '100%', backgroundColor: "#00FF00" }}>
                    <h1 className='text-center m-5'>Winner: <strong>{whiteTotal < blackTotal ? teamInfo[this.state.blackID].name : (whiteTotal > blackTotal ? teamInfo[this.state.whiteID].name : 'NONE')}</strong></h1>

                    {/* <div className="d-flex flex-row justify-content-center" >
                        <div style={{ width: 500, height: 500 }}>

                        </div>
                    </div> */}

                    <div className="game-site-log d-flex flex-row justify-content-center align-items-center" style={{
                        position: "absolute",
                        bottom: "10px"
                    }}>

                        <div className="game-sites">
                            <div className="d-flex flex-row justify-content-center align-items-center w-100 h-100" >

                                <Site size={siteSize} whiteScore={this.state.site[1]["White"]}
                                    blackScore={this.state.site[1]["Black"]} fontSizeDivider={1} />
                                <Site size={siteSize} whiteScore={this.state.site[2]["White"]}
                                    blackScore={this.state.site[2]["Black"]} fontSizeDivider={1} />


                                <Site size={siteSize * 1.5} whiteScore={this.state.site[0]["White"]}
                                    blackScore={this.state.site[0]["Black"]} fontSizeDivider={1} />

                                <Site size={siteSize} whiteScore={this.state.site[3]["White"]}
                                    blackScore={this.state.site[3]["Black"]} fontSizeDivider={1} />
                                <Site size={siteSize} whiteScore={this.state.site[4]["White"]}
                                    blackScore={this.state.site[4]["Black"]} fontSizeDivider={1} />

                            </div>
                        </div>


                    </div>
                        {(whiteTotal > blackTotal) && <img style={{ width: 700, height: 700, paddingTop: 90, paddingBottom: 90 }} src={whiteVictory}></img>}
                        {(blackTotal > whiteTotal) && <img style={{ width: 700, height: 700, paddingTop: 90, paddingBottom: 90 }} src={blackVictory}></img>}
                        {(blackTotal === whiteTotal) && <img style={{ width: 700, height: 700, paddingTop: 90, paddingBottom: 90 }} src={scoreTie}></img>}
                </div>
            )
        } else // in game
        {

            const siteSize = 80;

            let whiteTotal = this.state.scoreLog.filter(x => x["Side"] === "White").reduce((a, b) => a + parseInt(b["Score"]), 0)
            let blackTotal = this.state.scoreLog.filter(x => x["Side"] === "Black").reduce((a, b) => a + parseInt(b["Score"]), 0)

            return (
                <div className="game-main" style={{ width: '100%', height: '100%', backgroundColor: "#00FF00", paddingTop: 5 }}>

                    <div className='d-flex flex-row justify-content-between m-3 first-row'>

                        <div className="d-flex flex-column justify-content-start align-items-center">
                            {/* <TeamIcon side={'Black'} teamName={teamInfo[this.state.blackID].name}
                                teamImage={this.imgSet[this.state.blackID]} /> */}

                            <Statistic style={{ marginLeft: 10, marginTop: 10 }} suffix={<LeftCircleOutlined style={{ marginLeft: 10 }} />}
                                prefix={<RightCircleOutlined style={{ marginRight: 10 }} />} value={blackTotal}
                                valueStyle={{ textAlign: 'center', fontSize: 35 }} />

                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center title">
                            <div className="d-flex flex-row justify-content-center" style={{ width: 120, height: 50, borderRadius: 5, backgroundColor: "#FFFFFF", fontWeight: "bold" }}>
                                {this.state.state === "Start" && <Countdown title="" valueStyle={{ fontSize: 30 }} value={this.state.startTime + 300 * 1000} onChange={this.timeChange} format="mm:ss" />}
                                {this.state.state === "Game" && <div style={{ fontSize: 30 }}><b>05:00</b></div>}
                            </div>

                            <CountBar backgroundColor={'#f0f0f0'} color={"#0F2F89"} size={900}
                                curSeconds={this.state.gameTime} maxSeconds={300} isVertical={false} />

                            <div className='d-flex flex-row justify-content-around w-100' style={{ paddingTop: 5 }}>
                                <Site size={siteSize} whiteScore={this.state.site[1]["White"]}
                                    blackScore={this.state.site[1]["Black"]} fontSizeDivider={2} />
                                <Site size={siteSize} whiteScore={this.state.site[2]["White"]}
                                    blackScore={this.state.site[2]["Black"]} fontSizeDivider={2} />

                                <Site size={siteSize * 1.5} whiteScore={this.state.site[0]["White"]}
                                    blackScore={this.state.site[0]["Black"]} fontSizeDivider={1} />

                                <Site size={siteSize} whiteScore={this.state.site[3]["White"]}
                                    blackScore={this.state.site[3]["Black"]} fontSizeDivider={2} />
                                <Site size={siteSize} whiteScore={this.state.site[4]["White"]}
                                    blackScore={this.state.site[4]["Black"]} fontSizeDivider={2} />
                            </div>

                        </div>


                        <div className="d-flex flex-column justify-content-start align-items-center">
                            {/* <TeamIcon side={'White'} teamName={teamInfo[this.state.whiteID].name}
                                teamImage={this.imgSet[this.state.whiteID]} /> */}

                            <Statistic style={{ marginRight: 10, marginTop: 10 }} suffix={<LeftCircleOutlined style={{ marginLeft: 10 }} />}
                                prefix={<RightCircleOutlined style={{ marginRight: 10 }} />} value={whiteTotal}
                                valueStyle={{ textAlign: 'center', fontSize: 35 }} />
                        </div>

                    </div>

                    {/* pop-up icons, e.g. bomb explosion, engineer wake-up/shutdown, etc. */}
                    <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-row justify-content-center" style={{ backgroundColor: "#00FF00", width: 320, height: 320, paddingLeft: 30 }}>
                            {/* black team explosion effect */}
                            <GifEffect animate={this.state.blackBomb} gif={explode}></GifEffect>
                        </div>
                        <div className="d-flex flex-row justify-content-center align-items-center" style={{ backgroundColor: "#00FF00", width: 320, height: 320 }}>
                            {/* engineer wake-up effect */}
                            <PngEffect animate={this.state.engineerShutdownVisible && this.state.state === "Start"} png={engineerShutdown}></PngEffect>
                            {/* engineer shutdown effect */}
                            <PngEffect animate={!this.state.engineerShutdownVisible && this.state.state === "Start"} png={engineerWakeup}></PngEffect>
                            {(this.state.state === "Start" && this.state.gameTime === 0) && <img style={{ width: 700, height: 700, paddingTop: 210 }} src={gameFinish}></img>}

                        </div>

                        <div className="d-flex flex-row justify-content-center" style={{ backgroundColor: "#00FF00", width: 320, height: 320, paddingRight: 30 }}>
                            {/* white team explosion effect */}
                            <GifEffect animate={this.state.whiteBomb} gif={explode}></GifEffect>
                        </div>
                    </div>

                </div>
            )
        }
    }


}

export default StreamPage