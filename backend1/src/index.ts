import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

console.log('Chess WebSocket server started on port 8080');


wss.on('connection', (ws) => {
    console.log('Client connected');
    gameManager.addUser(ws);
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

process.on('SIGINT', () => {
    console.log('Server shutting down...');
    gameManager.cleanup();
    wss.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});