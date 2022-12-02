import React from "react";
import JudgeButton from "../../components/judge_button/JudgeButton";

class GamePage extends React.Component<> {
    ws = new WebSocket("ws://localhost:5555")

    constructor(props) {
        super(props);
        this.numButtons = 5;
        this.state = {
            isLoadings: [false, false, false, false, false],
            isDsiableds: Array.from({ length: 5 }, i => i = false),
            number: 1,
        }
    }

    onLoaded(index) {
        const { isLoadings, isDsiableds } = this.state;
        isLoadings[index] = false;

        // wake all other buttons up
        for (let i = 0; i < this.numButtons; i++) {
            isDsiableds[i] = false;
        }

        this.setState({ isLoadings: isLoadings, isDsiableds: isDsiableds })
    }

    onClicked(index) {

        const { isLoadings, isDsiableds } = this.state;

        // only take reaction if not disabled or loading
        if (isDsiableds[index] === true || isLoadings[index] === true)
            return;
        console.log("start load")

        isLoadings[index] = true;

        // if operation succeeds, set all other buttons as disabled
        for (let i = 0; i < this.numButtons; i++) {
            isDsiableds[i] = true;
            if (i == index)
                isDsiableds[i] = false;
            console.log(index, ":", isDsiableds[i])
        }

        this.setState({ isLoadings: isLoadings, isDsiableds: isDsiableds, })

        setTimeout(() => {
            console.log("end load")
            this.onLoaded(index)
        }, 1800);
    }

    render() {
        return (
            <div className="judge-main">
                <div className="judge-buttons" style={{ height: 800, width: 800 }}>
                    <div className="d-flex align-content-center flex-row w-200 h-200">
                        <JudgeButton disabled={this.state.isDsiableds[1]} isLoading={this.state.isLoadings[1]} description={"Deploy a Soldier"} isDeduct={false} score={5} onClick={() => this.onClicked(1)} />
                        <JudgeButton disabled={this.state.isDsiableds[0]} isLoading={this.state.isLoadings[0]} description={"Block Opponent"} isDeduct={true} score={10} onClick={() => this.onClicked(0)} />
                        <JudgeButton disabled={this.state.isDsiableds[2]} isLoading={this.state.isLoadings[2]} description={"Deploy a General"} isDeduct={false} score={10} onClick={() => this.onClicked(2)} />
                        <JudgeButton disabled={this.state.isDsiableds[3]} isLoading={this.state.isLoadings[3]} description={"Stay on Ramp"} isDeduct={false} score={15} onClick={() => this.onClicked(3)} />
                        <JudgeButton disabled={this.state.isDsiableds[4]} isLoading={this.state.isLoadings[4]} description={"Occupy One Site"} isDeduct={false} score={80} onClick={() => this.onClicked(4)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage