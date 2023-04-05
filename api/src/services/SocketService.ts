import { gzipSync } from 'zlib';
import { io } from '@src/server';
import { IData } from '@interfaces/services/socketService';

// Define una interfaz para especificar el tipo de los datos a enviar a través del socket


// Enviar datos a través de un socket
export function sendToIO(room: string, data: IData): void {
    // Convertir los datos a formato JSON
    const jsonData = JSON.stringify(data);

    // Convertir los datos JSON a un búfer binario utilizando utf8 como codificación
    const bufferData = Buffer.from(jsonData, 'utf8');

    // Comprimir los datos usando gzip
    const compressedData = gzipSync(bufferData);

    // Enviar los datos comprimidos al socket del servidor
    io.to(room).emit('data', compressedData);
}

export default {
    sendToIO,
};
