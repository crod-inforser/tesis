const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const zlib = require('zlib');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Función para generar datos aleatorios
function getRandomData() {
  const data = {
    temperature: (Math.random() * (30 - 15) + 15).toFixed(2),
    humidity: (Math.random() * (90 - 60) + 60).toFixed(2),
    pressure: (Math.random() * (1100 - 900) + 900).toFixed(2),
    all: [
      {
        temperature: (Math.random() * (30 - 15) + 15).toFixed(2),
        humidity: (Math.random() * (90 - 60) + 60).toFixed(2),
        pressure: (Math.random() * (1100 - 900) + 900).toFixed(2),
      }
    ]
  };
  data.temperature = (Math.random() * (30 - 15) + 15).toFixed(2);
  data.humidity = (Math.random() * (90 - 60) + 60).toFixed(2);
  data.pressure = (Math.random() * (1100 - 900) + 900).toFixed(2);
  return data;
}

function sendToIO(room) {
  const data = getRandomData();
  const jsonData = JSON.stringify(data);
  const bufferData = Buffer.from(jsonData, 'utf8');
  io.to(room).emit('data', zlib.gzipSync(bufferData))
}

// Definir ruta para el streaming
app.post('/stream', (req, res) => {
  const room = req.body.room;
  const frequency = req.body.frequency;

  console.log("Streaming started in room", room);

  // Generar datos aleatorios y emitirlos a la sala cada 'frequency' milisegundos
  const intervalId = setInterval(() => sendToIO(room), frequency);

  // Agregar el intervalId al objeto 'intervals' para poder detener el streaming posteriormente
  intervals[room] = intervalId;

  res.status(200).send({
    message: `Streaming started in room ${room}`,
    success: true
  });
});

// Definir ruta para pausar el streaming
app.post('/stream/pause', (req, res) => {
  const room = req.body.room;
  console.log("Streaming paused", room);

  // Detener el intervalo correspondiente a la sala
  clearInterval(intervals[room]);

  res.status(200).send({
    message: "Streaming paused",
    success: true
  });
});

// Definir ruta para reanudar el streaming
app.post('/stream/resume', (req, res) => {
  const room = req.body.room;
  const frequency = req.body.frequency;
  console.log("Streaming resumed");

  // Generar datos aleatorios y emitirlos a la sala cada 'frequency' milisegundos
  const intervalId = setInterval(() => sendToIO(room), frequency);

  // Actualizar el intervalId correspondiente a la sala en el objeto 'intervals'
  intervals[room] = intervalId;

  res.status(200).send({
    message: "Streaming resumed",
    success: true
  });
});

app.post('/stream/stop', (req, res) => {
  const room = req.body.room;
  console.log("Streaming stopped");
  // Detener el intervalo correspondiente a la sala
  clearInterval(intervals[room]);
  // Dejar la sala
  const clients = io.sockets.adapter.rooms.get(room);

  if (clients && clients.size > 0) {
    clients.forEach((_, clientId) => {
      io.sockets.sockets.get(clientId).disconnect(true);
    });
  }

  // Eliminar la entrada correspondiente a la sala en el objeto 'intervals'
  delete intervals[room];

  res.status(200).send({
    message: "Streaming stopped",
    success: true
  });
});

// Inicializar objeto 'intervals'
const intervals = {};

// Inicializar conexión de sockets
io.on('connection', (socket) => {
  console.log('User connected');

  // Escuchar evento 'joinRoom'
  socket.on('joinRoom', (room) => {
    console.log(room)
    console.log(`User joined room ${room}`);
    socket.join(room);
  });

  // Escuchar evento 'disconnect'
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Iniciar servidor
http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
