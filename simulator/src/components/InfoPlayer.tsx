import { IPlayerProps } from '../interfaces'

const InfoPlayer: React.FC<IPlayerProps> = ({ player, scaleX, scaleY, info }): any => {
    return (
        info && player &&
        <g>
            {/* Rectángulo del fondo para la información del jugador */}
            <rect
                x={scaleX(player.position.x) -6}
                y={scaleY(player.position.y) -6}
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
                    y={scaleY(player.position.y)-2}
                >
                    Stamina: {player.stamina.toFixed(0)}
                </tspan>
                <tspan
                    x={scaleX(player.position.x)}
                    y={scaleY(player.position.y)-4}
                >
                    [ {player.position.x.toFixed(2)} , {player.position.y.toFixed(2)} ]
                </tspan>
            </text>
        </g>
    )
}

export default InfoPlayer;