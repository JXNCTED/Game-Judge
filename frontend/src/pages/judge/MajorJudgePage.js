import React from "react";
import {Button, Card, Form, InputNumber, message, Select} from "antd";
import ScoreLog from "../../components/socrelog/ScoreLog";
import ServerList from "../../service/utils";
import TextArea from "antd/es/input/TextArea";

const options=[
    {
        value: 1,
        label: 'A',
    },
    {
        value: 2,
        label: 'B',
    },
    {
        value: 3,
        label: 'C',
    },
    {
        value: 4,
        label: 'D',
    }
]

class MajorJudge extends React.Component<> {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            logLoading: false,
            logData: [],
            changeValue: null,
            changeReason: null,
            scoreLoading: false,
            stateLoading: false,
        }
        this.ws = new WebSocket(props.side === 'Black' ? ServerList['judge-b'] : ServerList['judge-w'])
        this.ws.onmessage = (m) => {
            if (m.data.split('^')[0] === "Ack") {
                if (m.data.split('^')[1] === "Success") {
                    message.success(m.data.split('^')[2] + ' Acknowledged')
                    this.onLogLoad()
                } else {
                    message.error('Invalid Request')
                }
                setTimeout(() => {
                    this.onClear()
                }, 1000);
            } else if (m.data.split('^')[0] === "Response") {
                this.setState({
                    logLoading: false,
                    logData: JSON.parse(m.data.split('^')[2])
                })
            }
        }
        this.ws.onopen = () => {
            this.onLogLoad()
        }
    }

    onLogLoad() {
        this.setState({
            logLoading: true,
        })
        this.ws.send("Request^Score")
    }

    onReset = (v) => {
        this.setState({
            stateLoading: true,
            scoreLoading: true
        })
        this.ws.send(`Admin^Reset^${v.black}+${v.white}`)
    }

    onStateChange = (s) => {
        this.setState({
            stateLoading: true,
            scoreLoading: true
        })
        this.ws.send(`Admin^${s}`)
    }

    onChangeScore = (v) => {
        this.setState({
            scoreLoading: true
        })
        this.ws.send(`Score^Modify^${v.score}+${v.reason===""||v.reason==null?"Manually Change":v.reason}`)
    }

    onSetRecall = (ind) => {
        let score = -this.state.logData[ind].Score
        let reason = `RECALL ${this.state.logData[ind].Event}`
        this.setState({
            changeValue: score,
            changeReason: reason,
        }, () => {
            this.formRef.current.setFieldsValue({
                score: score,
                reason: reason,
            })
        })
    }

    onClear = () => {
        this.setState({
            changeValue: null,
            changeReason: null,
            scoreLoading: false,
            stateLoading: false,
        }, () => {
            this.formRef.current.setFieldsValue({
                score: null,
                reason: null,
            })
        })
    }

    render() {
        return (
            <div>
                <div className='d-flex flex-row'>
                    <div className='d-flex flex-column'>
                        <div className='major-set-state' style={{width: 400}}>
                            <Card className="m-2" title={<h2>Change State</h2>}>
                                <Card size='small'>
                                    <Form layout="inline" onFinish={this.onReset}>
                                        <Form.Item label='Black' name='black' style={{marginLeft: 15}}>
                                            <Select style={{width: 80}}>
                                                {options.map((item) => {
                                                    return <Select.Option value={item.value}>{item.label}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='White' name='white'>
                                            <Select style={{width: 80}}>
                                                {options.map((item) => {
                                                    return <Select.Option value={item.value}>{item.label}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Button className="m-2 w-100" type='primary' htmlType='submit' danger loading={this.state.stateLoading} >
                                            RESET GAME
                                        </Button>
                                    </Form>
                                </Card>

                                <Button className="m-2 w-100" type='primary' danger loading={this.state.stateLoading} onClick={()=>this.onStateChange('Game')} >
                                    GAME PAGE
                                </Button>
                                <Button className="m-2 w-100" type='primary' danger loading={this.state.stateLoading} onClick={()=>this.onStateChange('Start')} >
                                    START COUNTING
                                </Button>
                                <Button className="m-2 w-100" type='primary' danger loading={this.state.stateLoading} onClick={()=>this.onStateChange('Settle')} >
                                    GAME SETTLED
                                </Button>
                            </Card>
                        </div>
                        <div className='major-change-score'>
                            <Card className="m-2" title={<h2>Modify Score</h2>}>
                                <div>
                                    <Form onFinish={this.onChangeScore} ref={this.formRef}>
                                        <Form.Item name="score" label="Score" rules={[{required: true}]}>
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item name="reason" label="Reason">
                                            <TextArea />
                                        </Form.Item>
                                        <Button className='m-2' type="primary" htmlType="submit" loading={this.state.scoreLoading}>
                                            Submit
                                        </Button>
                                        <Button className='m-2' type="default" onClick={this.onClear} loading={this.state.scoreLoading}>
                                            Clear
                                        </Button>
                                    </Form>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className='major-score-log m-2 d-flex flex-column'>
                        <Button type={'primary'} className='m-3' size='large' loading={this.state.logLoading}
                                onClick={() => this.onLogLoad()}>
                            Load Newest Log
                        </Button>
                        <ScoreLog side={this.props.side} data={this.state.logData} recallBtn={this.onSetRecall}/>
                    </div>
                </div>
            </div>
        )

    }
}

export default MajorJudge