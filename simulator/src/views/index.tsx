import React, { useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Tooltip, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from "react-router-dom";
import useGame from '../hooks/useGame';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3eeff', // Color pastel de fondo 1
    },
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        width: '600px',
        backgroundColor: '#e0fefe', // Color pastel de fondo 2
    },
    icon: {
        fontSize: '72px',
        marginBottom: theme.spacing(1),
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(5),
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#d0d1f9', // Color pastel 3
        color: '#000',
        '&:hover': {
            backgroundColor: '#d0d1f9', // Color pastel en hover
        },
    },
    deleteButton: {
        color: '#febcc8', // Color pastel 4
    },
    errorMessage: {
        color: '#e57373', // Color pastel 4
        marginBottom: theme.spacing(2),
    },
}));

export const App: React.FC = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [url, setUrl] = useState('');

    const { sendURL, sendFile } = useGame();

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (validateFileExtension(file)) {
            setSelectedFile(file);
            setError('');
        } else {
            setError('El archivo debe tener la extensión ".rcg.gz".');
        }
    };

    const validateFileExtension = (file: File) => {
        const allowedExtensions = ['.rcg.gz'];
        const extensions = file.name.split('.')
        const lastExtention = extensions.pop();
        const firstExtention = extensions.pop();
        return allowedExtensions.includes(`.${firstExtention}.${lastExtention}`);
    };
    const validateURL = (str: string) => {
        const initialURL = ['https://archive.robocup.info/Soccer/Simulation/2D/logs/RoboCup/'];
        const allowedExtensions = ['.rcg.gz'];
        const originalURL = str.split(initialURL[0]);
        const extensions = str.split('.')
        const lastExtention = extensions.pop();
        const firstExtention = extensions.pop();
        console.log(originalURL.length, originalURL[0], `.${firstExtention}.${lastExtention}`)

        return (
            allowedExtensions.includes(`.${firstExtention}.${lastExtention}`)
            && originalURL.length === 2 && originalURL[0] === ''
        );
    };


    const handleFileDelete = () => {
        if (selectedFile) setSelectedFile(null);
        else setUrl('')
        setError('')
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        if (!validateURL(event.target.value))
            setError('El archivo debe tener la extensión ".rcg.gz" y provenir del banco publico de robocup');
        else setError('')
        if (!event.target.value) setError('')
    };

    const handleSubmit = () => {
        navigate("/simulator");
        if (url) sendURL(url)
        if(selectedFile) sendFile(selectedFile)
    };

    return (
        <Box className={classes.container}>
            <Paper className={classes.paper} onDrop={handleFileDrop} onDragOver={(event) => event.preventDefault()}>
                {!selectedFile && (
                    <>
                        <CloudUploadIcon className={classes.icon} />
                        <Typography variant="h5" gutterBottom>
                            Ingresa una URL o arrastra un archivo
                        </Typography>
                        <TextField
                            label="Ingresa una URL"
                            variant="outlined"
                            value={url}
                            onChange={handleUrlChange}
                            margin="normal"
                            fullWidth
                        />
                        <Typography variant="body2" className={classes.errorMessage}>
                            {error}
                        </Typography>
                    </>
                )}
                {selectedFile && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Archivo seleccionado:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {selectedFile.name}
                        </Typography>
                    </>
                )}
                <Box className={classes.buttonGroup}>
                    <Button
                        variant="contained"
                        className={classes.submitButton}
                        onClick={handleSubmit}
                        disabled={!selectedFile && !url}
                    >
                        Espectar
                    </Button>
                    {
                        (selectedFile || url) && (
                            <Tooltip title="Limpiar">
                                <IconButton className={classes.deleteButton} onClick={handleFileDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    }

                </Box>
            </Paper>
        </Box>
    );
};

export default App;