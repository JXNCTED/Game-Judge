import React from "react";
import Site from "../../components/site/Site";

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
                <div className="game-sites" style={{height: 500, width: 500}}>
                    <div className="d-flex align-content-center flex-row w-100 h-100">
                        <div className="d-flex flex-column justify-content-between w-100 h-100"
                             onClick={() => {
                                 console.log(this.state.testScore1, this.state.testScore2);
                                 this.state.testScore1 > this.state.testScore2 ? this.setState({testScore2: this.state.testScore2 + 2}) : this.setState({testScore1: this.state.testScore1 + 2})
                             }}>
                            <Site size={150} whiteScore={this.state.testScore1} blackScore={this.state.testScore2}/>
                            <Site size={150} whiteScore={0} blackScore={1}/>
                        </div>
                        <div className="d-flex flex-column justify-content-center w-100 h-100">
                            <Site size={180} whiteScore={10} blackScore={10}/>
                        </div>
                        <div className="d-flex flex-column justify-content-between w-100 h-100">
                            <Site size={150} whiteScore={1} blackScore={0}/>
                            <Site size={150} whiteScore={0} blackScore={0}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage