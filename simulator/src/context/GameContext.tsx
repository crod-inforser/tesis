import React, { createContext, useEffect, useReducer, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import { inflate } from 'pako';

const initialGameState = {
    room: null,
    connectionStatus: 'Conectando...',
    isConnected: false,
    data: [],
    speed: 1,
    isPaused: false,
    currentIndex: 0,
    type: '',
    url: '',
    file: null,
}

const socketURI = process.env.REACT_APP_SOCKET || process.env.SOCKET || 'http://localhost:3000';

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

const waitMe = (seconds: number) => {
    return new Promise((resolve) => { setTimeout(() => { resolve(1) }, seconds * 1000) })
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_CONNECTED': {
            return {
                ...state,
                isConnected: action.payload
            }
        }
        case 'SET_CURRENT_INDEX': {
            return {
                ...state,
                currentIndex: action.payload
            }
        }
        case 'SET_IS_PAUSED': {
            return {
                ...state,
                isPaused: action.payload
            }
        }
        case 'SET_SPEED': {
            return {
                ...state,
                speed: action.payload
            }
        }
        case 'CLEAN_DATA': {
            return {
                ...initialGameState
            }
        }
        case 'ADD_DATA': {
            return {
                ...state,
                data: state.data.concat([action.payload])
            }
        }
        case 'SET_ROOM': {
            return {
                ...state,
                room: action.payload.room,
            }
        }
        case 'SET_CONNECTION_STATUS': {
            return {
                ...state,
                connectionStatus: action.payload
            }
        }
        case 'START': {
            return {
                ...state,
                ...initialGameState,
                type: action.payload.type,
                url: action.payload.url,
                file: action.payload.file,
            }
        }
        default: {
            return { ...state }
        }
    }
}

export const GameContext = createContext({
    ...initialGameState,
    baseSpeed: 100,
    sendURL: (a: any) => { },
    setSpeed: () => { },
    setCurrentIndex: () => { },
    useInterval: (a: any, b: any) => { },
    resume: () => { },
    pause: () => { },
    interval: (a: any) => { },
    sendFile: (a: any) => { },
    clean: () => { },
})

export const GameProvider: React.FC<any> = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialGameState);


    function initiateSocket() {
        const socket = io(socketURI);
        socket.on('data', (data: any) => {
            const plainData = inflate(data, { to: 'string' });
            const parsed = JSON.parse(plainData);
            if (parsed.players) dispatch({ type: 'ADD_DATA', payload: parsed });
        });
        socket.on('connect', () => {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Conectado!' });
            dispatch({ type: 'SET_CONNECTED', payload: true })
        });
        socket.on('disconnect', () => {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Desconectado del servidor de Socket.io' });
            dispatch({ type: 'SET_CONNECTED', payload: false })
        });
        dispatch({ type: 'SET_SOCKET', payload: { socket } });
        return socket
    }

    const sendURL = async (url: string) => {
        const socket = initiateSocket()

        while (!socket || !socket.connected) {
            await waitMe(1)
        }

        const room = uuidv4();
        dispatch({ type: 'SET_ROOM', payload: { room } });

        socket.emit('joinRoom', room);

        fetch(`${socketURI}/api/convert/url`, {
            ...options,
            body: JSON.stringify({ room, url }),
        });

        dispatch({ type: 'START', payload: { type: 'url', url } })
    }

    const sendFile = async (file: string) => {
        const socket = initiateSocket()

        while (!socket || !socket.connected) {
            await waitMe(1)
        }

        const room = uuidv4();
        dispatch({ type: 'SET_ROOM', payload: { room } });

        socket.emit('joinRoom', room);

        const formData = new FormData();
        formData.append('rcgFile', file);
        formData.append('room', room);

        fetch(`${socketURI}/api/convert/upload`, {
            method: 'POST',
            body: formData,
        });


        dispatch({ type: 'START', payload: { type: 'file', file } })
    }

    const setSpeed = (speed: number) =>
        dispatch({ type: 'SET_SPEED', payload: speed });

    const setCurrentIndex = (index: number) =>
        dispatch({ type: 'SET_CURRENT_INDEX', payload: index });


    const useInterval = (callback: () => void, delay: number | null) => {
        const savedCallback = useRef(callback);
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            if (delay === null) return;
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }, [delay]);
    }

    const resume = () => dispatch({ type: 'SET_IS_PAUSED', payload: false })

    const pause = () => dispatch({ type: 'SET_IS_PAUSED', payload: true })

    const interval = (analyzeData: any) => {
        if (!state.isPaused && state.data.length > 0) {
            if (state.data[state.currentIndex + 1])
                dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex + 1 })
            else {
                dispatch({ type: 'SET_IS_PAUSED', payload: true })
                dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 })
            }
            analyzeData(state.data[state.currentIndex])
        }
    }

    const clean = () => dispatch({ type: 'CLEAN_DATA' })


    const value = {
        ...state,
        baseSpeed: 100,
        sendURL,
        setSpeed,
        setCurrentIndex,
        useInterval,
        resume,
        pause,
        interval,
        sendFile,
        clean
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContext
