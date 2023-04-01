const io = require('socket.io-client');
const axios = require('axios');
const zlib = require('zlib');

function start() {
    axios.post('http://localhost:3000/stream', { room: "data-stream", frequency: 100 })
        .then(response => {
            console.log("stream", response.data); // Accedemos a los datos utilizando response.data.data

            // Establecer la conexión con el servidor
            const socket = io('http://localhost:3000');
            socket.emit('joinRoom', 'data-stream');
            
            socket.on('data', data => {
                const uncompressed = zlib.gunzipSync(data);
                const parsed = JSON.parse(uncompressed.toString())
                console.log(parsed)
            });

        })
        .catch(error => {
            console.error(error);
        })
}

function pause() {
    axios.post('http://localhost:3000/stream/pause', { room: "data-stream" })
        .then(response => {
            console.log("pause", response.data); // Accedemos a los datos utilizando response.data.data
        })
        .catch(error => {
            console.error(error);
        })
}

function resume() {
    axios.post('http://localhost:3000/stream/resume', { room: "data-stream", frequency: 100 })
        .then(response => {
            console.log("resume", response.data); // Accedemos a los datos utilizando response.data.data
        })
        .catch(error => {
            console.error(error);
        })
}

function stop() {
    axios.post('http://localhost:3000/stream/stop', { room: "data-stream" })
        .then(response => {
            console.log("stop", response.data); // Accedemos a los datos utilizando response.data.data
        })
        .catch(error => {
            console.error(error);
        })
}

start();
setTimeout(pause, 5000);
setTimeout(resume, 9000);
setTimeout(stop, 15000);