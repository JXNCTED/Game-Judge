import React from "react";
import Site from "../../components/site/Site";
import ScoreLog from "../../components/socrelog/ScoreLog";
// import Countdown from "../../components/countdown/Countdown";

class GamePage extends React.Component<> {
    ws = new WebSocket("ws://localhost:5555")

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
            scoreLog: []
        }
        this.ws.onmessage = (m) => {
            if(m.data === "TESTING")
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
        return (
            <div className="game-main" style={{width: '100%'}}>
                <div className="game-site-log d-flex flex-row justify-content-around">
                    <div className="game-log d-flex">
                        <ScoreLog width={500} height={800} side={"Black"} data={this.state.scoreLog.filter(x=>x["Side"]==="Black")} />
                    </div>
                    <div className="game-sites" style={{height: 600, width: 600}}>
                        <div className="d-flex align-content-center flex-row w-100 h-100">
                            <div className="d-flex flex-column justify-content-between w-100 h-100">
                                <Site size={180} whiteScore={this.state.site[1]["White"]} blackScore={this.state.site[1]["Black"]}/>
                                <Site size={180} whiteScore={this.state.site[2]["White"]} blackScore={this.state.site[2]["Black"]}/>
                            </div>
                            <div className="d-flex flex-column justify-content-center w-100 h-100">
                                <Site size={210} whiteScore={this.state.site[0]["White"]} blackScore={this.state.site[0]["Black"]}/>
                            </div>
                            <div className="d-flex flex-column justify-content-between w-100 h-100">
                                <Site size={180} whiteScore={this.state.site[3]["White"]} blackScore={this.state.site[3]["Black"]}/>
                                <Site size={180} whiteScore={this.state.site[4]["White"]} blackScore={this.state.site[4]["Black"]}/>
                            </div>
                        </div>
                    </div>
                    <div className="game-log d-flex">
                        <ScoreLog width={500} height={800} side={"White"} data={this.state.scoreLog.filter(x=>x["Side"]==="White")} />
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage