import React from "react";
import "./TeamIcon.css";
import 'font-awesome/css/font-awesome.min.css';

function TeamIcon(props) {
    return (
        <div className="game-team-display">
            {/* eslint-disable-next-line react/style-prop-object */}
            {props.side==='White' &&
                <img src={props.teamImage} alt={props.teamName} />
            }
            <div className='d-flex flex-column'>
                <h2 className='d-flex flex-row'>
                    {props.teamName}
                </h2>
                <h4 className='w-100 text-center' style={{marginLeft: 10}}>
                    {props.side}
                </h4>
            </div>
            {props.side==='Black' &&
                <img style={{marginLeft: 15}} src={props.teamImage} alt={props.teamName} />
            }
            {/*<h1 style={{color: props.side==='White'?'#7DB9DE':'#005CAF', textShadow: '-2px -2px 0 #1115, 2px -2px 0 #1115, -2px 2px 0 #1115, 2px 2px 0 #1115'}}>{props.side + ' Side'}</h1>*/}
        </div>
    );
}

export default TeamIcon;
