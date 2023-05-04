import { IPlayerProps } from '../interfaces'
import { actions } from '../actions'

const Actions: React.FC<IPlayerProps> = ({ scaleX, scaleY, player }): any => {
    let validActions;
    if (player)
        validActions = (player.actions && player.actions.length) ? player.actions.filter(action => action === 'tackle' || action === 'kick') : [];

    return (
        validActions && validActions.length && player &&
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
    )
}

export default Actions;