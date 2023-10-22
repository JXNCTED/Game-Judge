// import {Button} from 'antd';
import {Button} from 'react-bootstrap';
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
            variant: p.variant,
            description: p.description,
            score: p.score,
            sign: p.isDeduct ? "-" : "+",
        };
    }

    render() {
        return (
            <Button style={{width: '100%'}} size='large' type="primary"
                    disabled={this.props.disabled}
                    loading={this.props.isLoading} onClick={() => this.props.onClick()}
                    variant={this.props.variant}
            >
                {this.state.description}: <strong> ({this.state.sign}{this.state.score})</strong>
            </Button>)
    }

}

export default JudgeButton;