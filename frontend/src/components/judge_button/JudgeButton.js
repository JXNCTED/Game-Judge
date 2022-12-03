import { Button } from 'antd';
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
        return (
            <Button style={{width: '100%'}} size='large' type="primary" disabled={this.props.disabled} danger={this.state.isDeduct} loading={this.props.isLoading} onClick={() => this.props.onClick()}>
                {this.state.description}: <strong> ({this.state.sign}{this.state.score})</strong>
            </Button>)
    }

}

export default JudgeButton;