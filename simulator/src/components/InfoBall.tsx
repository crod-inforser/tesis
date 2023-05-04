import React from 'react';
import { IBallProps } from '../interfaces'

// Definición de la interfaz de propiedades para el componente Ball


const Ball: React.FC<IBallProps> = ({ scaleX, scaleY, data, info }): any => {
    return (
        info &&
        <>
            <rect
                x={scaleX(data.ball.x) - 5}
                y={scaleY(data.ball.y) - 5}
                width="10"
                height="4"
                fill="black"
                opacity="0.7"
            />
            <text
                x={scaleX(data.ball.x)}
                y={scaleY(data.ball.y) - 3}
                fontSize="1.6"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
            >
                [ {data.ball.x.toFixed(2)} , {data.ball.y.toFixed(2)} ]
            </text>
        </>
    );
};

export default Ball;
