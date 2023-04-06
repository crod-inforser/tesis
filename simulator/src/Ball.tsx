import React from 'react';
import {IBallProps} from './interfaces'

// Definición de la interfaz de propiedades para el componente Ball


const Ball: React.FC<IBallProps> = ({ scaleX, scaleY, data, ballRadius, info }) => {
  return (
    <>
      {info && (
        <>
          {/* Rectángulo del fondo para las coordenadas */}
          <rect
            x={scaleX(data.ball.x) - 5}
            y={scaleY(data.ball.y) - 5}
            width="10"
            height="4"
            fill="black"
            opacity="0.7"
          />
          {/* Texto de las coordenadas */}
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
      )}
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
