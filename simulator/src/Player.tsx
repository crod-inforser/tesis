import { actions } from './actions'
import { IPlayerProps } from './interfaces'

const Player: React.FC<IPlayerProps> = ({ player, scaleX, scaleY, playerRadius, info }) => {
  const validActions = (player.actions && player.actions.length) ? player.actions.filter(action => action === 'tackle' || action === 'kick') : [];
  return (
    <>
      {/* Círculo que representa al jugador */}
      <circle
        cx={scaleX(player.position.x)}
        cy={scaleY(player.position.y)}
        r={playerRadius}
        fill={player.side === "l" ? "blue" : "red"}
        stroke={player.isGoalkeeper ? "yellow" : "none"}
        strokeWidth="0.3"
      />
      {/* Número del jugador */}
      <text
        x={scaleX(player.position.x)}
        y={scaleY(player.position.y)}
        fontSize="1.4"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {player.number}
      </text>

      {info && (
        <g>
          {/* Rectángulo del fondo para la información del jugador */}
          <rect
            x={scaleX(player.position.x) - 6}
            y={scaleY(player.position.y) - 6}
            width="12"
            height={5}
            fill="black"
            opacity="0.7"
          />
          {/* Texto de la información del jugador */}
          <text
            fontSize="1.5"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
          >
            <tspan
              x={scaleX(player.position.x)}
              y={scaleY(player.position.y) - 2}
            >
              Stamina: {player.stamina.toFixed(0)}
            </tspan>
            <tspan
              x={scaleX(player.position.x)}
              y={scaleY(player.position.y) - 4}
            >
              [ {player.position.x.toFixed(2)} , {player.position.y.toFixed(2)} ]
            </tspan>
          </text>
        </g>
      )}

      {validActions.length && (
        <>
          <g>
            {/* Rectángulo del fondo para las acciones del jugador */}
            <rect
              x={scaleX(player.position.x) - 10}
              y={scaleY(player.position.y)}
              width="20"
              height={(2 * validActions.length) + 1}
              fill="black"
              opacity="0.7"
            />
            {/* Texto de las acciones del jugador */}
            <text
              fontSize="1.5"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
            >
              {validActions.map((action, idx) => (
                <tspan key={idx} x={scaleX(player.position.x)} y={scaleY(player.position.y) + (idx * 2) + 2}>
                  jugador {player.side === 'l' ? 'azul' : 'rojo'} {player.number}: {actions[action]}
                </tspan>
              ))}
            </text>
          </g>
        </>
      )}
    </>
  );
};

export default Player;