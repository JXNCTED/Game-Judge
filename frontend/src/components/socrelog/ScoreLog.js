import React from "react";
import {Statistic, Table, Tag} from "antd";
import {DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";
import "./ScoreLog.css";

function ScoreLog(props) {
    const data = props.data
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
            width: 70,
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

    const score = data==null || data.length===0 ? 0 : data.reduce((a, b) => a + parseInt(b.Score), 0);
    const addon = data==null || data.length===0 ? 0 : data.at(data.length-1).Score;

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
                {props.side==="Black"?element:element.reverse()}
            </div>
            <div className="score-log-log d-flex w-100">
                <Table columns={columns} dataSource={data} size="small" pagination={false} />
            </div>
        </div>
    )
}

export default ScoreLog