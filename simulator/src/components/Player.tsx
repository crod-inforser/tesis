import { IPlayerProps } from '../interfaces'
import InfoPlayer from './InfoPlayer';
import Actions from './Actions';

const Player: React.FC<IPlayerProps> = (props): any => {
    const { player, scaleX, scaleY, playerRadius } = props;
    return (
        player &&
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

            <InfoPlayer {...props} />
            <Actions {...props} />
        </>
    );
};

export default Player;