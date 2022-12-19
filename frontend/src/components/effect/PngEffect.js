import React from "react";

/**
 * Creates a png display that flashes for a certain amount of time and disappears
 */
class PngEffect extends React.Component {
    /**
     * 
     * @param {object} props 
     * @param {boolean} props.animate if set from false to true (rising edge), the png will show once. a falling edge can interupt an on-going png animation
     * @param {png} props.png specify the png source (as you "import pngSource from <path>")
     */
    constructor(props) {
        super(props);

        this.state = {
            lastAnimate: false,
            curAnimate: false,
            animateDone: true,
            maxAnimateCount: 45,
            curAnimateCount: 0,
            showCount: 10,
            hideCount: 5,
            showing: false,
        };
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {

            this.setState({ curAnimate: this.props.animate });

            if (this.state.curAnimate !== this.state.lastAnimate && this.state.curAnimate) {
                this.setState({ lastAnimate: true, animateDone: false, curAnimateCount: 0 }) // start animation
            }
            else if (this.state.curAnimate !== this.state.lastAnimate && !this.state.curAnimate) {
                this.setState({ lastAnimate: false, animateDone: true, curAnimateCount: this.state.maxAnimateCount }) // abort current animation if not ended
            }

            const { maxAnimateCount, curAnimateCount } = this.state;

            if (!this.state.animateDone) {
                this.setState({ curAnimateCount: curAnimateCount + 1 })

                if (curAnimateCount + 1 >= this.state.maxAnimateCount) {
                    this.setState({ animateDone: true });
                }
                else // we perform flashing here
                {
                    let stage = curAnimateCount % (this.state.showCount + this.state.hideCount);
                    if (stage < this.state.showCount) {
                        this.setState({ showing: true })
                    }
                    else {
                        this.setState({ showing: false })
                    }
                }
            }


        }, 50)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        if (!this.state.animateDone && this.state.showing) {
            return (<img style={{ width: 300, height: 300 }} src={this.props.png} alt="png" />);
        } else { return (<div></div>); }
    }
}

export default PngEffect;