import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { inflate } from 'pako';
import { v4 as uuidv4 } from 'uuid';

let socket: Socket;
let room: string;

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState('Conectando con el servidor de Socket.io...');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket = io('http://localhost:3000');
    room = uuidv4();

    // Conectar al socket y escuchar el evento "data"
    socket.on('data', (data: any) => {
      const plainData = inflate(data, { to: 'string' });
      console.log(`Received data: ${plainData}`);
      setMessages((prevMessages) => [...prevMessages, plainData]);
    });

    // Escuchamos el evento "connect"
    socket.on('connect', () => {
      setConnectionStatus('Conectado al servidor de Socket.io');
      socket.emit('joinRoom', room);
    });

    // Escuchamos el evento "disconnect"
    socket.on('disconnect', () => {
      setConnectionStatus('Desconectado del servidor de Socket.io');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendPostRequest = () => {

    // Datos del cuerpo de la petición
    const body = JSON.stringify({
      url: 'https://archive.robocup.info/Soccer/Simulation/2D/logs/RoboCup/2021/Round1/GroupF/20210624201353-Oxsy_2-vs-CYRUS_4.rcg.gz',
      room,
    });

    // Configuración de la petición
    const options = {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Enviar la petición
    fetch('http://localhost:3000/api/convert/url', options);

    socket.emit('joinRoom', room);
  };

  return (
    <div>
      <p id="connection-status">{connectionStatus}</p>
      <button onClick={sendPostRequest}>Enviar petición POST y conectar a socket</button>
      <div id="messages">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
