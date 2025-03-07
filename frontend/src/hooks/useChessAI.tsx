import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessAI, DifficultyLevel } from '../services/ChessAI';

export const useComputerGame = () => {
  const [chess, setChess] = useState<Chess>(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [gameStarted, setGameStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [gameStatus, setGameStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  
  const aiRef = useRef<ChessAI | null>(null);
  
  useEffect(() => {
    aiRef.current = new ChessAI(chess, difficulty);
  }, [chess, difficulty]);
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  const startGame = useCallback((color: 'white' | 'black' = 'white', selectedDifficulty: DifficultyLevel = 'medium') => {
    const newChess = new Chess();
    setChess(newChess);
    setBoard(newChess.board());
    setPlayerColor(color);
    setCurrentTurn('white'); 
    setGameStarted(true);
    setGameStatus(`Game started. You are playing as ${color}.`);
    setIsCheck(false);
    setIsCheckmate(false);
    setWinner(null);
    setLastMove(null);
    setDifficulty(selectedDifficulty);
    
    aiRef.current = new ChessAI(newChess, selectedDifficulty);
    
    if (color === 'black') {
      setTimeout(() => makeComputerMove(), 500);
    }
  }, []);
  
  const updateGameState = useCallback(() => {
    setBoard(chess.board());
    setCurrentTurn(chess.turn() === 'w' ? 'white' : 'black');
    setIsCheck(chess.isCheck());
    setIsCheckmate(chess.isCheckmate());
    
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'black' : 'white';
      setWinner(winner);
      setGameStatus(`Checkmate! ${winner} wins!`);
    } else if (chess.isDraw()) {
      setGameStatus("Game over! It's a draw.");
      setWinner('draw');
    } else if (chess.isCheck()) {
      setGameStatus(`Check!`);
    } else {
      setGameStatus(`${chess.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  }, [chess]);
  
  const makeComputerMove = useCallback(() => {
    if (!gameStarted || !aiRef.current) return;
    
    if (chess.isGameOver()) return;
    
    const isComputerTurn = 
      (playerColor === 'white' && currentTurn === 'black') ||
      (playerColor === 'black' && currentTurn === 'white');
    
    if (!isComputerTurn) return;
    
    setIsComputerThinking(true);
    
    setTimeout(() => {
      try {
        const move = aiRef.current?.makeMove();
        
        if (move) {

          const result = chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion
          });
          
          if (result) {
            setLastMove({ from: move.from, to: move.to });
            updateGameState();
            const moveSound = new Audio("/sounds/move.mp3");
            moveSound.volume = 0.5;
            moveSound.play().catch((e) => console.log("Error playing sound:", e));
          }
        }
      } catch (error) {
        console.error("Error making computer move:", error);
      } finally {
        setIsComputerThinking(false);
      }
    }, difficulty === 'easy' ? 500 : difficulty === 'medium' ? 1000 : 1500); // Thinking time based on difficulty
    
  }, [chess, gameStarted, playerColor, currentTurn, difficulty, updateGameState]);
  
  useEffect(() => {
    const isComputerTurn = 
      (playerColor === 'white' && currentTurn === 'black') ||
      (playerColor === 'black' && currentTurn === 'white');
    
    if (gameStarted && isComputerTurn && !chess.isGameOver() && !isComputerThinking) {
      makeComputerMove();
    }
  }, [gameStarted, playerColor, currentTurn, chess, makeComputerMove, isComputerThinking]);
  
  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    if (!gameStarted) return false;
    
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
      
      const result = chess.move({ from, to, promotion });
      
      if (result) {
        setLastMove({ from, to });
        updateGameState();
        
        const moveSound = new Audio("/sounds/move.mp3");
        moveSound.volume = 0.5;
        moveSound.play().catch((e) => console.log("Error playing sound:", e));
        
        return true;
      } else {
        setErrorMessage("Invalid move");
        return false;
      }
    } catch (error) {
      console.error("Error making move:", error);
      setErrorMessage("Invalid move");
      return false;
    }
  }, [chess, gameStarted, playerColor, currentTurn, updateGameState]);
  
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setPlayerColor('white');
    setCurrentTurn('white');
    setGameStatus(null);
    setIsCheck(false);
    setIsCheckmate(false);
    setWinner(null);
    setLastMove(null);
    const newChess = new Chess();
    setChess(newChess);
    setBoard(newChess.board());
  }, []);
  
  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    if (aiRef.current) {
      aiRef.current.setDifficulty(newDifficulty);
    }
  }, []);
  
  return {
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
    difficulty,
    isComputerThinking,
    startGame,
    makeMove,
    resetGame,
    changeDifficulty
  };
};