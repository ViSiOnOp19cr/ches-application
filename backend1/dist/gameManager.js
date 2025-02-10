"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        console.log('added user');
        this.users.push(socket);
        this.handleMessage(socket, '');
    }
    removeUser(socket) {
        this.users = this.users.filter(s => s !== socket);
    }
    handleMessage(socket, message) {
        console.log("inside handler");
        socket.onmessage = (event) => {
            console.log('inside onmessage');
            console.log(event.data);
            const message = JSON.parse(event.data.toString());
            console.log("message is " + message);
            if (message.type === message_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log('pending user');
                    this.pendingUser = socket;
                }
            }
            if (message.type === message_1.MOVE) {
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if (game) {
                    console.log('making move');
                    console.log(message.move);
                    game.makeMove(socket, message.move);
                }
            }
        };
    }
}
exports.GameManager = GameManager;
