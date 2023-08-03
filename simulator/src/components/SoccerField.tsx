// Import React and components
import React from 'react';
import Players from './Players';
import Ball from './Ball';
import { ISoccerFieldProps } from '../interfaces'

// SoccerField component
const SoccerField: React.FC<ISoccerFieldProps> = ({ data, info }) => {
    // Constants for field dimensions
    const fieldWidth = 106;
    const fieldHeight = 68;

    // Constants for viewBox dimensions
    const viewBoxWidth = 130;
    const viewBoxHeight = 80;

    // Constants for player and ball radius
    const playerRadius = 1;
    const ballRadius = 0.7;

    // Functions to scale the x and y positions
    const scaleX = (x: number) => (x + fieldWidth / 2) * (viewBoxWidth / fieldWidth);
    const scaleY = (y: number) => (y + fieldHeight / 2) * (viewBoxHeight / fieldHeight);

    const configInfo = { scaleX, scaleY, ballRadius, info, viewBoxHeight, viewBoxWidth, data, playerRadius }

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`-${viewBoxWidth / 8} -${viewBoxHeight / 6} ${viewBoxWidth * 1.25} ${viewBoxHeight * 1.25}`}
            style={{ background: '#61aa33',borderRadius: '0px 50px 50px 0px'  }}
        >
            {/* Field outline */}
            <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} strokeWidth={ballRadius} stroke="white" fill="none" />
            {/* Center line */}
            <line x1={viewBoxWidth / 2} y1="0" x2={viewBoxWidth / 2} y2={viewBoxHeight} strokeWidth={ballRadius} stroke="white" />

            {/* Center circle and dot */}
            <circle cx={viewBoxWidth / 2} cy={viewBoxHeight / 2} r="9.3" strokeWidth={ballRadius} stroke="white" fill="none" />
            <circle cx={viewBoxWidth / 2} cy={viewBoxHeight / 2} r={ballRadius} fill="white" />

            {/* Goal areas */}
            <rect x="-4" y="24" width="4" height="32" strokeWidth={ballRadius} stroke="white" fill="none" />
            <rect x={viewBoxWidth} y="24" width="4" height="32" strokeWidth={ballRadius} stroke="white" fill="none" />

            <Players {...configInfo} />
            <Ball {...configInfo} />
        </svg>
    );
};

export default SoccerField;