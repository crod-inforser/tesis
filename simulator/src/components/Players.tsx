import { IPlayerProps } from '../interfaces'
import Player from './Player';

const Players: React.FC<IPlayerProps> = (props): any => {
    const { data, scaleX, scaleY, playerRadius, info } = props;
    return (
        data && data.players && data.players.length && data.players.map((player, index) => (
            <Player
                scaleX={scaleX}
                scaleY={scaleY}
                player={player}
                key={index}
                info={info}
                playerRadius={playerRadius}
            />
        ))
    );
};

export default Players;