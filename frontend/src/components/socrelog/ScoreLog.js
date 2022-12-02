import React from "react";
import {Statistic, Table, Tag} from "antd";
import {DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";
import "./ScoreLog.css";

const data = [
    {
        "Time":"2022/12/03 01:40:29",
        "Side":"White",
        "Event":"Deploy a General",
        "Score":"10",
        "Type":"Rule"
    },
    {
        "Time":"2022/12/03 01:40:36",
        "Side":"White",
        "Event":"Carrier Not Staying on the Ramp",
        "Score":"-20",
        "Type":"Rule"
    },
    {
        "Time":"2022/12/03 01:40:46",
        "Side":"White",
        "Event":"Deliberate striking or blocking the opponent",
        "Score":"-20",
        "Type":"Rule"
    },
    {
        "Time":"2022/12/03 01:40:55",
        "Side":"White",
        "Event":"Stay on the ramp",
        "Score":"15",
        "Type":"Rule"
    },
    {
        "Time":"2022/12/03 01:41:11",
        "Side":"Black",
        "Event":"Deploy a General",
        "Score":"10",
        "Type":"Rule"
    },
    {
        "Time":"2022/12/03 01:41:13",
        "Side":"Black",
        "Event":"Deliberate striking or blocking the opponent",
        "Score":"-20",
        "Type":"Rule"
    }
]

function ScoreLog(props) {
    const columns = [
        {
            title: 'Time',
            dataIndex: 'Time',
            key: 'Time',
            render: (Time) => (
                <span>
                    {Time.split(" ")[1]}
                </span>
            )
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
            render: (Type) => (
                <span>
                    <Tag color={Type==='Rule'?'green':'volcano'} key={Type}>
                        {Type}
                    </Tag>
                </span>
            )
        },
        {
            title: 'Event',
            dataIndex: 'Event',
            key: 'Event',
            width: 350
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            key: 'Score',
            render: (Score) => (
                <span>
                    <Tag style={{width: 50}} color={Score>0?'green':'geekblue'} key={Score}>
                        <div className="m-auto" style={{textAlign: "center"}}><strong>{Score>0?'+':''}{Score}</strong></div>
                    </Tag>
                </span>
            )
        },
    ];

    const score = 985;
    const addon = -50;

    const element = [
        <div className="score-log-score d-flex">
            <Statistic title="Side" value={props.side}  />
        </div>,
        <div className="score-log-score d-flex">
            <Statistic title="Total Score" value={score}  />
        </div>,
        <div className="score-log-adding d-flex">
            <Statistic title="Last Change" value={Math.abs(addon)} prefix={addon>0?<UpCircleOutlined />:<DownCircleOutlined />} valueStyle={{color: addon>0 ? '#3f8600' : '#cf1322'}} />
        </div>
    ]

    return (
        <div className="score-log  d-flex flex-column" style={{width: props.width, height: props.height}}>
            <div className="score-log-header d-flex flex-row justify-content-around w-100">
                {props.side==="black"?element:element.reverse()}
            </div>
            <div className="score-log-log d-flex w-100">
                <Table columns={columns} dataSource={data} size="small" pagination={false} />
            </div>
        </div>
    )
}

export default ScoreLog