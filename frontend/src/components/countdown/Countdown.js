import React from "react";

class Countdown extends React.Component<> {

    /*
    * color
    * size
    * counting
    * seconds
    * minutes
    * isVertical
    * onFinish
    */

    constructor(p) {
        super(p);

        this.state = {
            backgroundColor: "#f0f0fe",
            maxMinutes: p.minutes,
            maxSeconds: p.seconds,
            curMinutes: p.minutes,
            curSeconds: p.seconds,
            curPercentage: 100,
            finished: false,
            color: p.color,
        }
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            if (!this.props.counting)
            {
                return;
            }

            const {maxMinutes, maxSeconds, curMinutes, curSeconds} = this.state

            if (curSeconds > 0) {
                this.setState({ curSeconds: curSeconds - 0.05 })
            }
            if (curSeconds <= 0) {
                if (curMinutes <= 0) {
                    this.props.onFinish();
                    this.setState({finished: true})
                    clearInterval(this.myInterval);
                } else {
                    this.setState({ curMinutes: curMinutes - 1, curSeconds: 59.95 })
                }
            }

            this.setState({ curPercentage: this.state.finished ? 0 : 100 * (curMinutes * 60 + curSeconds) / (maxMinutes * 60 + maxSeconds)})

            if (this.state.curPercentage <= 20)
            {
                this.setState({ color: "#000000"})
            }
            
        }, 50)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const horizontalBackgroundStyle = {
            height: 30,
            width: this.props.size,
            backgroundColor: this.state.backgroundColor,
            borderRadius: 10,
            margin: 50,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
        };

        const horizontalFillingStyle = {
            height: '100%',
            width: `${this.state.curPercentage}%`,
            backgroundColor: this.state.color,
            borderRadius: 'inherit',
        };

        const verticalBackgroundStyle = {
            height: 30,
            width: this.props.size,
            backgroundColor: this.state.backgroundColor,
            borderRadius: 10,
            margin: 50,
            display: 'flex', justifyContent: 'right', alignItems: 'right',
            transform: 'rotate(90deg)',
        };

        const verticalFillingStyle = {
            height: '100%',
            width: `${this.state.curPercentage}%`,
            backgroundColor: this.state.color,
            borderRadius: 'inherit',
        };

        if (this.props.isVertical) {
            return (
                <div style={verticalBackgroundStyle}>
                    <div style={verticalFillingStyle}>
                    </div>
                </div>
            );
         }
        else {
            return (
                <div style={horizontalBackgroundStyle}>
                    <div style={horizontalFillingStyle}>
                    </div>
                </div>
            );
        }
    }
};

export default Countdown;