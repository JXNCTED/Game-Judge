import React from "react";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import "./ReadyIcon.css";
import 'font-awesome/css/font-awesome.min.css';

function ReadyIcon(props) {
    return (
        <div className="team-display">
            {/* eslint-disable-next-line react/style-prop-object */}
            <h1 style={{color: props.side==='White'?'#7DB9DE':'#005CAF', textShadow: '-2px -2px 0 #1115, 2px -2px 0 #1115, -2px 2px 0 #1115, 2px 2px 0 #1115'}}>{props.side + ' Side'}</h1>
            <img src={props.teamImage} alt={props.teamName} className={(props.isReady ? 'img-ready' : 'img-not-ready') + ' ' + (props.side==='Black' ? 'img-black' : 'img-white')} />
            <h2 className='d-flex flex-row'>
                <div className="auxiliary-graphics before">
                    <i className="fa fa-arrow-right"></i>
                </div>
                {props.teamName}
                <div className="auxiliary-graphics after">
                    <i className="fa fa-arrow-left"></i>
                </div>
            </h2>
            <div className="team-status">
                {props.isReady ? (
                    <span>
                        <CheckCircleOutlined style={{color: '#4CAF50'}}/>
                        <strong>Team is ready!</strong>
                    </span>
                            ) : (
                    <span>
                        <CloseCircleOutlined style={{color: '#F44336'}}/>
                        Team is under preparation.
                    </span>
                )}
            </div>
        </div>
    );
}

export default ReadyIcon;
