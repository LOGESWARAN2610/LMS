import React from 'react';
import Axis from './axis';

const XYAxis = ({ xScale, yScale, height, width, ticks, t }) => {

    const xSettings = {
        scale: xScale,
        orient: 'bottom',
        transform: `translate(0, ${height})`,
        t
    };
    const ySettings = {
        scale: yScale,
        orient: 'left',
        transform: 'translate(0, 0)',
        ticks,
        t
    };
    return (
        <g className="axis-group">
            <Axis {...xSettings} />
            <text transform={`translate(-30,${height / 2}),rotate(-90)`} className="axisLabel" >Hours</text>
            <Axis {...ySettings} />
            <text transform={`translate(${width / 2},${height + 40})`} className="axisLabel" >Date</text>
        </g >
    );
};

export default XYAxis;
