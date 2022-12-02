import { Button, Space } from 'antd';
import React from 'react';

class JudgeButton extends React.Component {

    /*
    * isDeduct
    * description
    * score
    * sign
    */

    constructor(p) {
        super(p);

        this.state = {
            isDeduct: p.isDeduct,
            description: p.description,
            score: p.score,
            sign: p.isDeduct ? "-" : "+",
        };
    }

    render() {
        console.log(this.props.isLoading)
        return (
            <Button type="primary" disabled={this.props.disabled} danger={this.state.isDeduct} loading={this.props.isLoading} onClick={() => this.props.onClick()}>
                {this.state.description} ({this.state.sign}{this.state.score})
            </Button>)
    }

};

export default JudgeButton;