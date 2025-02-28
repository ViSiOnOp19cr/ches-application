"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManager_1 = require("./gameManager");
// Create a WebSocket server on port 8080
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new gameManager_1.GameManager();
console.log('Chess WebSocket server started on port 8080');
// Handle incoming connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Add the new user to the game manager
    gameManager.addUser(ws);
    // Error handling
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    gameManager.cleanup();
    wss.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
