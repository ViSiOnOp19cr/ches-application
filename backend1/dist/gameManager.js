"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const message_1 = require("./message");
const game_1 = require("./game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingPlayers = new Map();
        this.playerToGame = new Map();
        this.matchmakingInterval = null;
        // Start the matchmaking process
        this.matchmakingInterval = setInterval(() => this.processMatchmaking(), 1000);
        console.log("GameManager initialized, matchmaking process started");
    }
    // Clean up when the server is shutting down
    cleanup() {
        if (this.matchmakingInterval) {
            clearInterval(this.matchmakingInterval);
        }
    }
    // Add a new user connection
    addUser(socket) {
        console.log("New user connected");
        this.setupSocketHandlers(socket);
    }
    // Handle a user disconnection
    removeUser(socket) {
        // Remove from pending players if they were waiting
        this.pendingPlayers.delete(socket);
        // If they were in a game, handle the game disconnection
        const game = this.playerToGame.get(socket);
        if (game) {
            game.handleDisconnect(socket);
            this.playerToGame.delete(socket);
            // Clean up the game if both players are gone
            const isPlayer1 = game.player1 === socket;
            const otherPlayer = isPlayer1 ? game.player2 : game.player1;
            if (!this.playerToGame.has(otherPlayer)) {
                this.games = this.games.filter(g => g !== game);
                console.log("Game removed due to both players disconnecting");
            }
        }
        console.log("User disconnected");
    }
    // Set up WebSocket event handlers for a user
    setupSocketHandlers(socket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleMessage(socket, message);
            }
            catch (error) {
                console.error("Error parsing message:", error);
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Invalid message format"
                    }
                }));
            }
        });
        socket.on("close", () => {
            this.removeUser(socket);
        });
        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
            this.removeUser(socket);
        });
    }
    // Process a message from a user
    handleMessage(socket, message) {
        console.log("Received message:", message.type);
        switch (message.type) {
            case message_1.PLAYER_READY:
                this.handlePlayerReady(socket);
                break;
            case message_1.INIT_GAME:
                this.handleInitGame(socket);
                break;
            case message_1.MOVE:
                this.handleMove(socket, message.payload);
                break;
            case "RESIGN":
                this.handleResign(socket);
                break;
            case "DRAW_OFFER":
                this.handleDrawOffer(socket);
                break;
            default:
                console.log("Unknown message type:", message.type);
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Unknown message type"
                    }
                }));
        }
    }
    // Handle a player indicating they're ready to play
    handlePlayerReady(socket) {
        console.log("Player ready for matchmaking");
        // Add to pending players if not already in a game
        if (!this.playerToGame.has(socket)) {
            this.pendingPlayers.set(socket, {
                ready: true,
                timestamp: Date.now()
            });
            socket.send(JSON.stringify({
                type: "MATCHMAKING",
                payload: {
                    status: "searching",
                    message: "Looking for an opponent..."
                }
            }));
            // Try immediate matchmaking
            this.processMatchmaking();
        }
    }
    // Handle a game initialization request
    handleInitGame(socket) {
        console.log("Player requesting game initialization");
        // Same as player ready - add to matchmaking
        if (!this.playerToGame.has(socket)) {
            this.pendingPlayers.set(socket, {
                ready: true,
                timestamp: Date.now()
            });
            socket.send(JSON.stringify({
                type: "MATCHMAKING",
                payload: {
                    status: "searching",
                    message: "Looking for an opponent..."
                }
            }));
            this.processMatchmaking();
        }
    }
    // Handle a move request
    handleMove(socket, moveData) {
        console.log("Player attempting move:", moveData);
        const game = this.playerToGame.get(socket);
        if (!game) {
            console.log("Move rejected: Player not in a game");
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "You are not in a game"
                }
            }));
            return;
        }
        game.makeMove(socket, moveData.move);
    }
    // Handle a resignation
    handleResign(socket) {
        const game = this.playerToGame.get(socket);
        if (!game)
            return;
        const isWhitePlayer = game.player1 === socket;
        const winner = isWhitePlayer ? "black" : "white";
        const gameOverMessage = JSON.stringify({
            type: "GAME_OVER",
            payload: {
                winner: winner,
                reason: "resignation"
            }
        });
        game.player1.send(gameOverMessage);
        game.player2.send(gameOverMessage);
        // Remove the game
        this.cleanupGame(game);
    }
    // Handle a draw offer
    handleDrawOffer(socket) {
        const game = this.playerToGame.get(socket);
        if (!game)
            return;
        const isWhitePlayer = game.player1 === socket;
        const otherPlayer = isWhitePlayer ? game.player2 : game.player1;
        otherPlayer.send(JSON.stringify({
            type: "DRAW_OFFER",
            payload: {
                from: isWhitePlayer ? "white" : "black"
            }
        }));
    }
    // Process matchmaking to pair waiting players
    processMatchmaking() {
        if (this.pendingPlayers.size < 2)
            return;
        // Get all ready players sorted by wait time (oldest first)
        const readyPlayers = Array.from(this.pendingPlayers.entries())
            .filter(([_, data]) => data.ready)
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .map(([socket, _]) => socket);
        // Match players in pairs
        while (readyPlayers.length >= 2) {
            const player1 = readyPlayers.shift();
            const player2 = readyPlayers.shift();
            // Create a new game
            this.createGame(player1, player2);
        }
    }
    // Create a game between two players
    createGame(player1, player2) {
        console.log("Creating new game between two players");
        // Remove from pending list
        this.pendingPlayers.delete(player1);
        this.pendingPlayers.delete(player2);
        // Create the game and track the players
        const game = new game_1.Game(player1, player2);
        this.games.push(game);
        this.playerToGame.set(player1, game);
        this.playerToGame.set(player2, game);
        console.log(`Game created successfully. Total active games: ${this.games.length}`);
    }
    // Clean up a finished game
    cleanupGame(game) {
        // Remove from the player-to-game mapping
        if (this.playerToGame.get(game.player1) === game) {
            this.playerToGame.delete(game.player1);
        }
        if (this.playerToGame.get(game.player2) === game) {
            this.playerToGame.delete(game.player2);
        }
        // Remove from the games list
        this.games = this.games.filter(g => g !== game);
        console.log(`Game removed. Total active games: ${this.games.length}`);
    }
}
exports.GameManager = GameManager;
