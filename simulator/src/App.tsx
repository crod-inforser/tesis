// App.js
import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { inflate } from 'pako';
import { v4 as uuidv4 } from 'uuid';

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';

import SoccerField from './SoccerField';

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

  const analyzeData = (data: any) => {
    const ballPosition = data.ball;
    let closestPlayer: any | null = null;
    let minDistance = Infinity;
    const tacklesIntention: any = []
    data.players.forEach((player: any) => {
      if (player.actions.includes('tackle')) tacklesIntention.push(player)
      const distance = Math.sqrt(
        Math.pow(player.position.x - ballPosition.x, 2) +
        Math.pow(player.position.y - ballPosition.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestPlayer = player;
      }
    });

    const passingIntention = closestPlayer.actions.includes('say');
    console.log("jugador: ", closestPlayer?.number, closestPlayer?.side, passingIntention ? " da pase" : "")
    tacklesIntention.forEach((player: any) => console.log("jugador ", player.number, player.side, " intenta tacklear"))
  };


  useEffect(() => {
    socket = io(process.env.REACT_APP_SOCKET || process.env.SOCKET || 'http://localhost:3000');
    if (!room) room = uuidv4();

    socket.on('data', (data: any) => {
      const plainData = inflate(data, { to: 'string' });
      const parsed = JSON.parse(plainData);

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
    // Enviar la petición
    fetch((process.env.REACT_APP_SOCKET || 'http://localhost:3000') + '/api/convert/url', { ...options, body: JSON.stringify({ ...body, url }) });
  };


  const updateData = (newData: any) => {
    setData((prevData) => [...prevData, newData]);
  };

  useInterval(() => {
    if (!isPaused && data.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      analyzeData(data[currentIndex])
    }
  }, 100 / speed); // Adjust interval based on speed

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
    setSpeed(1)
  };

  return (
    <div>
      <p id="connection-status">{connectionStatus}</p>
      <button onClick={sendPostRequest}>Init</button>
      <button onClick={handleInfo}>View Info</button>


      <IconButton color="secondary" onClick={pause}>
        <PauseIcon />
      </IconButton>

      <IconButton color="secondary" onClick={resume}>
        <PlayArrowIcon />
      </IconButton>
      <br />
      <IconButton color="secondary" onClick={() => setSpeed(0.25)}>
        <FastRewindIcon />
        <FastRewindIcon />
      </IconButton>

      <IconButton color="secondary" onClick={() => setSpeed(0.5)}>
        <FastRewindIcon />
      </IconButton>


      <IconButton color="secondary" onClick={() => setSpeed(2)}>
        <FastForwardIcon />
      </IconButton>
      <IconButton color="secondary" onClick={() => setSpeed(4)}>
        <FastForwardIcon />
        <FastForwardIcon />
      </IconButton>
      <IconButton color="secondary" onClick={() => setSpeed(8)}>
        <FastForwardIcon />
        <FastForwardIcon />
        <FastForwardIcon />
      </IconButton>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <SoccerField data={data[currentIndex] || {}} info={info} />
      </div>
    </div>
  );
};

export default App;