"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManager_1 = require("./gameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new gameManager_1.GameManager();
wss.on('connection', ws => {
    gameManager.addUser(ws);
    ws.on('error', console.error);
    ws.on('close', () => {
        gameManager.removeUser(ws);
    });
});
