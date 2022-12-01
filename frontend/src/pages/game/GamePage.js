import React from "react";
import Site from "../../components/site/Site";
import Countdown from "../../components/countdown/Countdown";

class GamePage extends React.Component<> {

    constructor(props) {
        super(props);
        this.state = {
            testScore1: 1,
            testScore2: 0
        }
    }

    render() {
        return (
            <div className="game-main">
                <div className="countdown-tester">
                    <div className="d-flex align-content-center flex-row w-100 h-100">
                        <Countdown color={'#ff1000'} isVertical={true} size={250} minutes={0} seconds={3} onFinish={() => {console.log("finished countdown 1")}} counting={true}/>
                        <Countdown color={'#00ff10'} isVertical={true} size={350} minutes={0} seconds={6} onFinish={() => {console.log("finished countdown 2")}} counting={true}/>
                        <Countdown color={'#1000ff'} isVertical={true} size={450} minutes={0} seconds={9} onFinish={() => {console.log("finished countdown 3")}} counting={true} />
                        <Countdown color={'#ff1000'} isVertical={false} size={250} minutes={0} seconds={3} onFinish={() => {console.log("finished countdown 4")}} counting={true}/>
                        <Countdown color={'#00ff10'} isVertical={false} size={350} minutes={0} seconds={6} onFinish={() => {console.log("finished countdown 5")}} counting={true}/>
                        <Countdown color={'#1000ff'} isVertical={false} size={450} minutes={0} seconds={9} onFinish={() => {console.log("finished countdown 6")}} counting={true}/>
                    </div>
                </div>
                <div className="game-sites" style={{ height: 500, width: 500 }}>
                    <div className="d-flex align-content-center flex-row w-100 h-100">
                        <div className="d-flex flex-column justify-content-between w-100 h-100"
                            onClick={() => {
                                console.log(this.state.testScore1, this.state.testScore2);
                                this.state.testScore1 > this.state.testScore2 ? this.setState({ testScore2: this.state.testScore2 + 2 }) : this.setState({ testScore1: this.state.testScore1 + 2 })
                            }}>
                            <Site size={150} whiteScore={this.state.testScore1} blackScore={this.state.testScore2} />
                            <Site size={150} whiteScore={0} blackScore={1} />
                        </div>
                        <div className="d-flex flex-column justify-content-center w-100 h-100">
                            <Site size={180} whiteScore={10} blackScore={10} />
                        </div>
                        <div className="d-flex flex-column justify-content-between w-100 h-100">
                            <Site size={150} whiteScore={1} blackScore={0} />
                            <Site size={150} whiteScore={0} blackScore={0} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage