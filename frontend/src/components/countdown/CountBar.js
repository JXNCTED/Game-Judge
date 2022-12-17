import React from "react";

function CountBar(props) {
    let curPercentage = 100 * props.curSeconds / props.maxSeconds

    const horizontalBackgroundStyle = {
        height: 30,
        width: props.size,
        backgroundColor: props.backgroundColor,
        borderRadius: 10,
        margin: 10,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    };

    const horizontalFillingStyle = {
        height: '100%',
        width: `${curPercentage}%`,
        backgroundColor: props.color,
        borderRadius: 'inherit',
    };

    const verticalBackgroundStyle = {
        height: props.size,
        width: 30,
        backgroundColor: props.backgroundColor,
        borderRadius: 10,
        margin: 10,
        display: 'flex', justifyContent: 'right', alignItems: 'right',
        // transform: 'rotate(90deg)',
    };

    const verticalFillingStyle = {
        width: '100%',
        height: `${curPercentage}%`,
        backgroundColor: props.color,
        alignSelf: 'flex-end',
        borderRadius: 'inherit',
    };

    if (props.isVertical) {
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
export default CountBar;