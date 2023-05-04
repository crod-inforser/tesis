// App.js
import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { inflate } from 'pako';
import { v4 as uuidv4 } from 'uuid';

import { Grid, Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';

import { states } from './states'
import SoccerField from './SoccerField';
import { EActions, ESide, IData, IPlayer } from './interfaces';

let socket: Socket;
let room: string;

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [data, setData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [info, setInfo] = useState(false)
  const [speed, setSpeed] = useState(1);
  const [ballPossessionCount, setBallPossessionCount] = useState<{ team1: number, team2: number }>({ team1: 0, team2: 0 });
  const [pp1, setPp1] = useState(0)
  const [pp2, setPp2] = useState(0)
  const baseSpeed = 100;

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


  useEffect(() => {
    socket = io(process.env.REACT_APP_SOCKET || process.env.SOCKET || 'http://localhost:3000');
    if (!room) room = uuidv4();

    socket.on('data', (data: any) => {
      const plainData = inflate(data, { to: 'string' });
      const parsed = JSON.parse(plainData);
      console.log(parsed)
      if (parsed.players) {
        updateData(parsed);
      }
    });

    socket.on('connect', () => {
      setConnectionStatus('Conectado!');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Desconectado del servidor de Socket.io');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const body = {
    room
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const handleInfo = () => setInfo(!info)

  const sendPostRequest = () => {
    socket.emit('joinRoom', room);
    const url = 'https://archive.robocup.info/Soccer/Simulation/2D/logs/RoboCup/2021/Round1/GroupF/20210624201353-Oxsy_2-vs-CYRUS_4.rcg.gz'
    fetch((process.env.REACT_APP_SOCKET || 'http://localhost:3000') + '/api/convert/url', { ...options, body: JSON.stringify({ ...body, url }) });
  };


  const updateData = (newData: any) => setData((prevData) => [...prevData, newData]);


  useInterval(() => {
    if (!isPaused && data.length > 0) {
      setCurrentIndex((prevIndex) => {
        if (data[prevIndex + 1]) return prevIndex + 1
        setIsPaused(true)
        return 0
      });
      analyzeData(data[currentIndex])
    }
  }, baseSpeed / speed); // Adjust interval based on speed

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);


  return (
    <Grid container>
      <Grid item sm={4} md={4} lg={4} style={{
        display: 'flex', flexDirection: 'column', height: '95vh', backgroundColor: 'gray',
        borderRadius: '50px 0px 0px 50px', padding: 30, alignItems: 'center'
      }}>

        {/* TIEMPO */}
        <Grid style={{
          backgroundColor: 'black', border: '10px solid white', padding: 20, color: 'yellow',
          fontWeight: 'bold', fontSize: 50, borderRadius: 40
        }}>
          {new Date(((data && data[currentIndex] && data[currentIndex]?.time) || 0) * baseSpeed).toISOString().slice(14, 19)}
        </Grid>

        {/* SCORE */}
        <Grid container style={{ marginTop: 10 }}>
          <Grid item md={5} style={{
            backgroundColor: 'black', padding: 20, color: 'blue',
            fontWeight: 'bold', fontSize: 50, borderRadius: 10, marginTop: 10,
            marginBottom: 10, textAlign: 'center'
          }}>
            {(data && data[currentIndex] && data[currentIndex].score && data[currentIndex].score.team1) || 0}
          </Grid>
          <Grid item md={2}> </Grid>
          <Grid item md={5} style={{
            backgroundColor: 'black', padding: 20, color: 'red',
            fontWeight: 'bold', fontSize: 50, borderRadius: 10, marginTop: 10,
            marginBottom: 10, textAlign: 'center'
          }}>
            {(data && data[currentIndex] && data[currentIndex].score && data[currentIndex].score.team2) || 0}
          </Grid>
        </Grid>

        {/* POSETION */}
        <Grid container style={{ marginTop: 10 }}>
          <Grid item md={5} style={{
            backgroundColor: 'black', padding: 20, color: 'blue',
            fontWeight: 'bold', fontSize: 50, borderRadius: 10, marginTop: 10,
            marginBottom: 10, textAlign: 'center'
          }}>
            {`${pp1.toFixed(1)}%`}
          </Grid>
          <Grid item md={2}> </Grid>
          <Grid item md={5} style={{
            backgroundColor: 'black', padding: 20, color: 'red',
            fontWeight: 'bold', fontSize: 50, borderRadius: 10, marginTop: 10,
            marginBottom: 10, textAlign: 'center'
          }}>
            {`${pp2.toFixed(1)}%`}
          </Grid>
        </Grid>

        {/* STATE */}
        <Grid style={{
          backgroundColor: 'black', border: '10px solid white', padding: 20, color: 'white',
          fontWeight: 'bold', fontSize: 40, borderRadius: 40, marginTop: 10
        }}>
          {data && data[currentIndex] && states[data[currentIndex].state]}
        </Grid>
        {/* ACTIONS */}
        <Grid container style={{ marginTop: 10 }}>
          <Grid item md={12} style={{ textAlign: 'center' }}>
            <Button color="primary" variant="contained" style={{ marginRight: 10 }} onClick={sendPostRequest}> Iniciar</Button>
            <Button color="secondary" variant="contained" onClick={handleInfo}> Ver información</Button>
          </Grid>
          <Grid item md={12} style={{ marginTop: 10, textAlign: 'center' }}>
            <Button color="primary" variant="contained" style={{ marginRight: 10 }} onClick={resume}><PlayArrowIcon /></Button>
            <Button color="primary" variant="contained" onClick={pause}><PauseIcon /></Button>
          </Grid>
          <Grid item md={12} style={{ marginTop: 10, textAlign: 'center' }}>
            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(0.25)}>0.25</Button>
            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(0.5)}>0.5</Button>
            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(1)}>1</Button>
            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(2)}>2</Button>
            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(4)}>4</Button>
            <Button color="secondary" variant="contained" onClick={() => setSpeed(8)}>8</Button>
          </Grid>
        </Grid>
        <p>{connectionStatus}</p>
      </Grid>
      <Grid item sm={8} md={8} lg={8} style={{ width: '100%', height: '95vh' }}>
        <SoccerField data={data[currentIndex] || {}} info={info} />
      </Grid>
    </ Grid>
  );
};

export default App;