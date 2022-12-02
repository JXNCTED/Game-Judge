import React from "react";
import Site from "../../components/site/Site";
// import Countdown from "../../components/countdown/Countdown";

class GamePage extends React.Component<> {
    ws = new WebSocket("ws://localhost:5555")

    constructor(props) {
        super(props);
        this.state = {
            score:
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
        }
        this.ws.onmessage = (m) => {
            if(m.data === "TESTING")
                return
            if (m.data.split('^')[1] === "Score") {

            } else if (m.data.split('^')[1] === "State") {

            } else if (m.data.split('^')[1] === "Site") {
                this.setState({score: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))})
            }
        }
    }

    render() {
        return (
            <div className="game-main">
                {/*<div className="countdown-tester">*/}
                {/*    <div className="d-flex align-content-center flex-row w-100 h-100">*/}
                {/*        <Countdown color={'#ff1000'} isVertical={true} size={250} minutes={0} seconds={3}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 1")*/}
                {/*                   }} counting={true}/>*/}
                {/*        <Countdown color={'#00ff10'} isVertical={true} size={350} minutes={0} seconds={6}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 2")*/}
                {/*                   }} counting={true}/>*/}
                {/*        <Countdown color={'#1000ff'} isVertical={true} size={450} minutes={0} seconds={9}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 3")*/}
                {/*                   }} counting={true}/>*/}
                {/*        <Countdown color={'#ff1000'} isVertical={false} size={250} minutes={0} seconds={3}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 4")*/}
                {/*                   }} counting={true}/>*/}
                {/*        <Countdown color={'#00ff10'} isVertical={false} size={350} minutes={0} seconds={6}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 5")*/}
                {/*                   }} counting={true}/>*/}
                {/*        <Countdown color={'#1000ff'} isVertical={false} size={450} minutes={0} seconds={9}*/}
                {/*                   onFinish={() => {*/}
                {/*                       console.log("finished countdown 6")*/}
                {/*                   }} counting={true}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="game-sites" style={{height: 800, width: 800}}>
                    <div className="d-flex align-content-center flex-row w-100 h-100">
                        <div className="d-flex flex-column justify-content-between w-100 h-100"
                             onClick={() => {
                                 console.log(this.state.testScore1, this.state.testScore2);
                                 this.state.testScore1 > this.state.testScore2 ? this.setState({testScore2: this.state.testScore2 + 2}) : this.setState({testScore1: this.state.testScore1 + 2})
                             }}>
                            <Site size={250} whiteScore={this.state.score[1]["White"]} blackScore={this.state.score[1]["Black"]}/>
                            <Site size={250} whiteScore={this.state.score[2]["White"]} blackScore={this.state.score[2]["Black"]}/>
                        </div>
                        <div className="d-flex flex-column justify-content-center w-100 h-100">
                            <Site size={300} whiteScore={this.state.score[0]["White"]} blackScore={this.state.score[0]["Black"]}/>
                        </div>
                        <div className="d-flex flex-column justify-content-between w-100 h-100">
                            <Site size={250} whiteScore={this.state.score[3]["White"]} blackScore={this.state.score[3]["Black"]}/>
                            <Site size={250} whiteScore={this.state.score[4]["White"]} blackScore={this.state.score[4]["Black"]}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage