// App.js
import { useState } from 'react';

import { Grid } from '@material-ui/core'

import { states } from '../states'
import SoccerField from '../components/SoccerField';
import { EActions, ESide, IData, IPlayer } from '../interfaces';
import Board from '../components/Board';
import useGame from '../hooks/useGame';

const App = () => {
  const [info, setInfo] = useState(false)
  const [ballPossessionCount, setBallPossessionCount] = useState<{ team1: number, team2: number }>({ team1: 0, team2: 0 });
  const [pp1, setPp1] = useState(0)
  const [pp2, setPp2] = useState(0)

  const {
    useInterval, data, currentIndex, interval, clean,
    resume, pause, connectionStatus, baseSpeed, setSpeed, speed } = useGame();

  const analyzeData = (data: IData) => {
    const ballPosition = data.ball;
    let closestPlayer: IPlayer | null = null;
    let minDistance = Infinity;
    const tacklesIntention: IPlayer[] = [];
    data.players?.forEach((player: IPlayer) => {
      if (player.actions?.includes(EActions.TACKLE)) { tacklesIntention.push(player); }
      const distance = Math.sqrt(Math.pow(player.position.x - ballPosition.x, 2) + Math.pow(player.position.y - ballPosition.y, 2));
      if (distance < minDistance) { minDistance = distance; closestPlayer = player; }
    });
    if (closestPlayer) {
      const cp = closestPlayer as IPlayer;
      const passingIntention = cp.actions?.includes(EActions.KICK) ?? false;
      console.log("jugador: ", cp.number, cp.side, passingIntention ? " da pase" : "");
      setBallPossessionCount((prevCount) => ({ ...prevCount, [cp.side === ESide.Left ? 'team1' : 'team2']: prevCount[cp.side === ESide.Left ? 'team1' : 'team2'] + 1 }));
    }
    tacklesIntention.forEach((player: IPlayer) => console.log("jugador ", player.number, player.side, " intenta tacklear"));
    const totalPossessions = ballPossessionCount.team1 + ballPossessionCount.team2;
    const team1BallPossessionPercentage = totalPossessions > 0 ? (ballPossessionCount.team1 / totalPossessions) * 100 : 0;
    setPp1(team1BallPossessionPercentage)
    const team2BallPossessionPercentage = totalPossessions > 0 ? (ballPossessionCount.team2 / totalPossessions) * 100 : 0;
    setPp2(team2BallPossessionPercentage)

  };


  const handleInfo = () => setInfo(!info)
  
  useInterval(() => {
    interval(analyzeData);
  }, baseSpeed / speed);


  const boardData = { clean, data, currentIndex, baseSpeed, pp1, pp2, states, handleInfo, pause, resume, setSpeed, connectionStatus };

  return (
    <Grid container>
      <Grid item sm={4} md={4} lg={4} style={{
        display: 'flex', flexDirection: 'column', height: '95vh', backgroundColor: 'gray',
        borderRadius: '50px 0px 0px 50px', padding: 30, alignItems: 'center'
      }}>
        <Board {...boardData} />
      </Grid>
      <Grid item sm={8} md={8} lg={8} style={{ width: '100%', height: '95vh' }}>
        <SoccerField data={data[currentIndex] || {}} info={info} />
      </Grid>
    </ Grid>
  );
};

export default App;