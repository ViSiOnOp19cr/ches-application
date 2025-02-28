import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { useSocket } from './usesocket';

// Message types
const INIT_GAME = 'INIT_GAME';
const MOVE = 'MOVE';
const GAME_STATE = 'GAME_STATE';
const GAME_OVER = 'GAME_OVER';
const PLAYER_READY = 'PLAYER_READY';
const ERROR = 'ERROR';
const CHECK = 'CHECK';

export const useChessGame = () => {
    const socket = useSocket();
    const [chess, setChess] = useState<Chess>(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [gameStarted, setGameStarted] = useState(false);
    const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
    const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
    const [gameStatus, setGameStatus] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCheck, setIsCheck] = useState(false);
    const [isCheckmate, setIsCheckmate] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);

    // clear the error message after 3 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    
    const initGame = useCallback(() => {
        if (!socket) return;
        
        console.log("Sending player ready message");
        socket.send(JSON.stringify({
            type: PLAYER_READY
        }));
        
        setGameStatus("Finding opponent...");
    }, [socket]);

    // Make a move
    const makeMove = useCallback((from: string, to: string, promotion?: string) => {
        if (!socket || !gameStarted) return false;
        
        try {
            //@ts-ignore
            const piece = chess.get(from);
            if (!piece) {
                setErrorMessage("No piece at selected square");
                return false;
            }
            
            const isWhitePiece = piece.color === 'w';
            const isPlayersTurn = 
                (playerColor === 'white' && isWhitePiece && currentTurn === 'white') || 
                (playerColor === 'black' && !isWhitePiece && currentTurn === 'black');
            
            if (!isPlayersTurn) {
                setErrorMessage(
                    playerColor !== currentTurn 
                        ? "Not your turn" 
                        : "You can only move your own pieces"
                );
                return false;
            }
            
            // Send the move to the server
            socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    move: { from, to, promotion }
                }
            }));
            
            return true;
        } catch (error) {
            console.error("Error making move:", error);
            setErrorMessage("Invalid move");
            return false;
        }
    }, [socket, chess, gameStarted, playerColor, currentTurn]);

    const processMove = useCallback((moveData: any) => {
        try {
            const { from, to, promotion } = moveData;

            const result = chess.move({ from, to, promotion });
            if (!result) {
                console.error("Invalid move received from server");
                return;
            }
            setBoard(chess.board());
            setLastMove({ from, to });

            setCurrentTurn(chess.turn() === 'w' ? 'white' : 'black');
            setIsCheck(chess.isCheck());
            setIsCheckmate(chess.isCheckmate());
            
            // updating game status
            if (chess.isCheckmate()) {
                const winner = chess.turn() === 'w' ? 'black' : 'white';
                setWinner(winner);
                setGameStatus(`Checkmate! ${winner} wins!`);
            } else if (chess.isDraw()) {
                setGameStatus("Game over! It's a draw.");
            } else if (chess.isCheck()) {
                setGameStatus(`Check!`);
            } else {
                setGameStatus(`${chess.turn() === 'w' ? 'White' : 'Black'}'s turn`);
            }
        } catch (error) {
            console.error("Error processing move:", error);
        }
    }, [chess]);

    const resetGame = useCallback(() => {
        const newChess = new Chess();
        setChess(newChess);
        setBoard(newChess.board());
        setGameStarted(false);
        setPlayerColor(null);
        setCurrentTurn('white');
        setGameStatus(null);
        setIsCheck(false);
        setIsCheckmate(false);
        setWinner(null);
        setLastMove(null);
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message:", message.type);
                
                switch (message.type) {
                    case INIT_GAME:

                        const { color, initialFen } = message.payload;
                        console.log(`Game initialized. You are playing as: ${color}`);
                        
                        setPlayerColor(color);
                        setGameStarted(true);
                        

                        if (initialFen) {
                            const newChess = new Chess(initialFen);
                            setChess(newChess);
                            setBoard(newChess.board());
                        }
                        
                        setGameStatus(`Game started. You are playing as ${color}.`);
                        break;
                        
                    case MOVE:

                        console.log("Move received:", message.payload);
                        processMove(message.payload);
                        break;
                        
                    case GAME_STATE:

                        const { turn, isCheck, isCheckmate, isDraw, isGameOver } = message.payload;
                        console.log(`Game state update. Turn: ${turn}`);
                        
                        setCurrentTurn(turn);
                        setIsCheck(isCheck);
                        setIsCheckmate(isCheckmate);

                        if (isGameOver) {
                            if (isCheckmate) {
                                const winner = turn === 'white' ? 'black' : 'white';
                                setWinner(winner);
                                setGameStatus(`Checkmate! ${winner} wins!`);
                            } else if (isDraw) {
                                setGameStatus("Game over! It's a draw.");
                            }
                        } else if (isCheck) {
                            setGameStatus(`Check! ${turn}'s turn.`);
                        } else {
                            setGameStatus(`${turn}'s turn`);
                        }
                        break;
                        
                    case GAME_OVER:

                        const { winner, reason } = message.payload;
                        console.log(`Game over. Winner: ${winner}, Reason: ${reason}`);
                        
                        setWinner(winner);
                        if (winner === "draw") {
                            setGameStatus(`Game over! It's a draw by ${reason}.`);
                        } else {
                            setGameStatus(`Game over! ${winner} wins by ${reason}!`);
                        }
                        break;
                        
                    case ERROR:

                        console.log("Error:", message.payload.message);
                        setErrorMessage(message.payload.message);
                        break;
                        
                    case CHECK:

                        setIsCheck(true);
                        setGameStatus(`Check! ${message.payload.inCheck === 'w' ? 'White' : 'Black'} is in check.`);
                        break;
                        
                    case "MATCHMAKING":

                        console.log("Matchmaking status:", message.payload.status);
                        setGameStatus(message.payload.message);
                        break;
                        
                    case "PLAYER_DISCONNECTED":

                        console.log("Player disconnected:", message.payload);
                        setGameStatus(`Game ended. ${message.payload.message}`);
                        break;
                        
                    default:
                        console.log("Unknown message type:", message.type);
                }
            } catch (error) {
                console.error("Error handling message:", error);
            }
        };
        
        socket.addEventListener('message', handleMessage);
        
        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, processMove]);

    return {
        socket,
        chess,
        board,
        gameStarted,
        playerColor,
        currentTurn,
        gameStatus,
        errorMessage,
        isCheck,
        isCheckmate,
        winner,
        lastMove,
        initGame,
        makeMove,
        resetGame
    };
};