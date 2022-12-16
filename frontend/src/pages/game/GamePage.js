import React from "react";
import Site from "../../components/site/Site";
import ScoreLog from "../../components/socrelog/ScoreLog";
import Coundtdown from "../../components/countdown/Countdown";
import ServerList from "../../service/utils";
import { View, Text } from "react-native";

class GamePage extends React.Component<> {
    ws = new WebSocket(ServerList['view']);

    constructor(props) {
        super(props);
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

            stage: "prep"
        }

        this.ws.onmessage = (m) => {
            if (m.data === "TESTING")
                return
            if (m.data.split('^')[1] === "Score") {
                this.setState({
                    scoreLog: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))
                })
            } else if (m.data.split('^')[1] === "State") {

            } else if (m.data.split('^')[1] === "Site") {
                this.setState({
                    site: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))
                })
            }
        }
    }

    render() {
        if (this.state.stage == "prep") {
            // preparation page
            return (
                <div className="game-main" style={{ width: '100%', height: '100%', backgroundColor: "#00FF00" }}>
                    <div className="d-flex flex-row justify-content-between">
                        <View style={styles.teamBlackRect}></View>
                        <View style={styles.timerRect}></View>
                        <View style={styles.teamWhiteRect}></View>
                    </div>
                    <div className="countdown d-flex flex-row justify-content-center">
                        <Coundtdown size={800} color={"#8F072F"} isVertical={false} minutes={3} seconds={0} counting={true}></Coundtdown>
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <View style={styles.mainView}></View>
                    </div>
                </div>
            );
        }
        else if (this.state.stage == "game") {
            // in-game page
        }
        else if (this.state.stage == "post") {
            // post-game page
        }

        // by default, return the following
        return (
            <div className="game-main" style={{ width: '100%', height: '100%', backgroundColor: "#00ff00" }}>
                <div className="game-site-log d-flex flex-row justify-content-around">
                    <div className="game-log d-flex">
                        <ScoreLog width={500} height={800} side={"Black"} data={this.state.scoreLog.filter(x => x["Side"] === "Black")} />
                    </div>
                    <div className="game-sites" style={{ height: 600, width: 600 }}>
                        <div className="d-flex align-content-center flex-row w-100 h-100">
                            <div className="d-flex flex-column justify-content-between w-100 h-100">
                                <Site size={180} whiteScore={this.state.site[1]["White"]} blackScore={this.state.site[1]["Black"]} />
                                <Site size={180} whiteScore={this.state.site[2]["White"]} blackScore={this.state.site[2]["Black"]} />
                            </div>
                            <div className="d-flex flex-column justify-content-center w-100 h-100">
                                <Site size={210} whiteScore={this.state.site[0]["White"]} blackScore={this.state.site[0]["Black"]} />
                            </div>
                            <div className="d-flex flex-column justify-content-between w-100 h-100">
                                <Site size={180} whiteScore={this.state.site[3]["White"]} blackScore={this.state.site[3]["Black"]} />
                                <Site size={180} whiteScore={this.state.site[4]["White"]} blackScore={this.state.site[4]["Black"]} />
                            </div>
                        </div>
                    </div>
                    <div className="game-log d-flex">
                        <ScoreLog width={500} height={800} side={"White"} data={this.state.scoreLog.filter(x => x["Side"] === "White")} />
                    </div>
                </div>
            </div>
        );
    }


}

const styles = {
    timerRect: {
        width: '160px',
        height: '60px',
        background: "blue",
    },

    teamBlackRect: {
        width: '120px',
        height: '90px',
        background: "black",
    },

    teamWhiteRect: {
        width: '120px',
        height: '90px',
        background: "white",
    },

    mainView: {
        width: '900px',
        height: '735px',
        background: "#00FF00",
    },
}

export default GamePage