import React from 'react';
import { IBallProps } from '../interfaces'
import InfoBall from './InfoBall'

const Ball: React.FC<IBallProps> = (props) => {
    const { scaleX, scaleY, data, ballRadius } = props
    return (
        data.ball &&
        <>
            <InfoBall {...props} />
            {/* Círculo que representa el balón */}
            <circle
                cx={scaleX(data.ball.x)}
                cy={scaleY(data.ball.y)}
                r={ballRadius}
                fill="black"
            />
        </>
    );
};

export default Ball;
