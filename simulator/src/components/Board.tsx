import { Button, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import { useNavigate } from "react-router-dom";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import BackspaceIcon from '@material-ui/icons/Backspace';

const Board: React.FC<any> = (props) => {
    const navigate = useNavigate();
    const { data, currentIndex, baseSpeed, pp1, pp2, states, handleInfo, pause, resume, setSpeed, connectionStatus, clean } = props
    return (
        <>
            <Grid container alignItems="flex-start">
                <IconButton onClick={() => { clean(); navigate("/"); }}>
                    <BackspaceIcon />
                </IconButton>
            </Grid>
            {/* TIEMPO */}
            < Grid style={{
                backgroundColor: 'black', border: '10px solid white', padding: 20, color: 'yellow',
                fontWeight: 'bold', fontSize: 50, borderRadius: 40
            }
            }>
                {new Date(((data && data[currentIndex] && data[currentIndex]?.time) || 0) * baseSpeed).toISOString().slice(14, 19)}
            </ Grid>

            {/* SCORE */}
            < Grid container style={{ marginTop: 10 }}>
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
            </Grid >

            {/* POSETION */}
            < Grid container style={{ marginTop: 10 }}>
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
            </Grid >

            {/* STATE */}
            < Grid style={{
                backgroundColor: 'black', border: '10px solid white', padding: 20, color: 'white',
                fontWeight: 'bold', fontSize: 40, borderRadius: 40, marginTop: 10
            }}>
                {data && data[currentIndex] && states[data[currentIndex].state]}
            </Grid >
            {/* ACTIONS */}
            < Grid container style={{ marginTop: 10 }}>
                <Grid item md={12} style={{ textAlign: 'center' }}>
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
                </Grid>
                <Grid item md={12} style={{ marginTop: 10, textAlign: 'center' }}>
                    <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(2)}>2</Button>
                    <Button color="secondary" variant="contained" style={{ marginRight: 10 }} onClick={() => setSpeed(4)}>4</Button>
                    <Button color="secondary" variant="contained" onClick={() => setSpeed(8)}>8</Button>
                </Grid>
            </Grid >
            <p>{connectionStatus}</p>
        </>
    );
};

export default Board;
