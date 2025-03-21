"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.gameId = `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        console.log(`[Game ${this.gameId}] New game started between two players`);
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white",
                gameId: this.gameId,
                initialFen: this.board.fen()
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black",
                gameId: this.gameId,
                initialFen: this.board.fen()
            }
        }));
        this.broadcastGameState();
    }
    broadcastGameState() {
        const gameState = {
            type: message_1.GAME_STATE,
            payload: {
                fen: this.board.fen(),
                turn: this.board.turn() === 'w' ? 'white' : 'black',
                isCheck: this.board.isCheck(),
                isCheckmate: this.board.isCheckmate(),
                isDraw: this.board.isDraw(),
                isGameOver: this.board.isGameOver(),
                moveCount: this.moveCount,
                gameId: this.gameId
            }
        };
        console.log(`[Game ${this.gameId}] Broadcasting game state: ${this.board.turn()} to move`);
        this.player1.send(JSON.stringify(gameState));
        this.player2.send(JSON.stringify(gameState));
    }
    makeMove(socket, move) {
        const isWhitePlayer = socket === this.player1;
        const isBlackPlayer = socket === this.player2;
        const currentTurn = this.board.turn();
        console.log(`[Game ${this.gameId}] Move attempt: ${move.from} to ${move.to} by ${isWhitePlayer ? 'white' : 'black'} player`);
        if ((currentTurn === 'w' && !isWhitePlayer) || (currentTurn === 'b' && !isBlackPlayer)) {
            console.log(`[Game ${this.gameId}] Invalid move: Not ${currentTurn === 'w' ? 'white' : 'black'}'s turn`);
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: `It's not your turn. Current turn: ${currentTurn === 'w' ? 'white' : 'black'}`
                }
            }));
            return;
        }
        try {
            const result = this.board.move(move);
            if (!result) {
                throw new Error("Invalid move");
            }
            console.log(`[Game ${this.gameId}] Move successful: ${move.from} to ${move.to}`);
            this.moveCount++;
            const moveMessage = JSON.stringify({
                type: message_1.MOVE,
                payload: {
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion,
                    color: currentTurn === 'w' ? 'white' : 'black',
                    piece: result.piece,
                    fen: this.board.fen()
                }
            });
            this.player1.send(moveMessage);
            this.player2.send(moveMessage);
            if (this.board.isGameOver()) {
                let winner = null;
                let reason = "unknown";
                if (this.board.isCheckmate()) {
                    winner = currentTurn === 'w' ? 'black' : 'white';
                    reason = "checkmate";
                    console.log(`[Game ${this.gameId}] Game over by checkmate. Winner: ${winner}`);
                }
                else if (this.board.isDraw()) {
                    winner = "draw";
                    if (this.board.isStalemate()) {
                        reason = "stalemate";
                    }
                    else if (this.board.isThreefoldRepetition()) {
                        reason = "repetition";
                    }
                    else if (this.board.isInsufficientMaterial()) {
                        reason = "insufficient material";
                    }
                    else {
                        reason = "50-move rule";
                    }
                    console.log(`[Game ${this.gameId}] Game over by ${reason}.`);
                }
                const gameOverMessage = JSON.stringify({
                    type: message_1.GAME_OVER,
                    payload: {
                        winner: winner,
                        reason: reason,
                        fen: this.board.fen()
                    }
                });
                this.player1.send(gameOverMessage);
                this.player2.send(gameOverMessage);
            }
            else {
                this.broadcastGameState();
            }
        }
        catch (error) {
            console.error(`[Game ${this.gameId}] Error making move:`, error);
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Invalid move: " + (error instanceof Error ? error.message : "Unknown error")
                }
            }));
        }
    }
    handleDisconnect(socket) {
        const isWhitePlayer = socket === this.player1;
        const playerColor = isWhitePlayer ? "white" : "black";
        const otherPlayer = isWhitePlayer ? this.player2 : this.player1;
        console.log(`[Game ${this.gameId}] Player (${playerColor}) disconnected`);
        otherPlayer.send(JSON.stringify({
            type: "PLAYER_DISCONNECTED",
            payload: {
                color: playerColor,
                message: `Your opponent (${playerColor}) has disconnected`
            }
        }));
    }
}
exports.Game = Game;
