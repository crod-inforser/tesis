const axios = require('axios');

function start() {
  axios.post('http://localhost:3000/stream', {
    room: "first-room", frequency: 1000, dataFormat: "json"
  })
    .then(response => {
      console.log("stream", response.data); // Accedemos a los datos utilizando response.data.data
    })
    .catch(error => {
      console.error(error);
    })
}

function pause() {
  axios.post('http://localhost:3000/stream/pause', {})
    .then(response => {
      console.log("pause", response.data); // Accedemos a los datos utilizando response.data.data
    })
    .catch(error => {
      console.error(error);
    })
}
function resume() {
  axios.post('http://localhost:3000/stream/resume', {})
    .then(response => {
      console.log("resume", response.data); // Accedemos a los datos utilizando response.data.data
    })
    .catch(error => {
      console.error(error);
    })
}

start()
setTimeout(pause, 5000);
setTimeout(resume, 9000);