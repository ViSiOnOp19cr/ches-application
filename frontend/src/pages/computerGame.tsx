import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChessBoard } from "../components/chessboard";
import { useComputerGame } from "../hooks/useChessAI";
import { DifficultyLevel } from "../services/ChessAI";

export const ComputerGame = () => {
  const {
    chess,
    board,
    gameStarted,
    playerColor,
    currentTurn,
    gameStatus,
    errorMessage,
    isCheck,
    winner,
    lastMove,
    difficulty,
    isComputerThinking,
    startGame,
    makeMove,
    resetGame,
    changeDifficulty
  } = useComputerGame();

  const [showGameOptions, setShowGameOptions] = useState(!gameStarted);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedColor, setPlayerColor] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (isCheck && !winner) {
      const checkSound = new Audio("/sounds/check.mp3");
      checkSound.volume = 0.5;
      checkSound.play().catch((e) => console.log("Error playing sound:", e));
    }
  }, [isCheck, winner]);


  if (showGameOptions && !gameStarted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-800">
        <div className="bg-slate-700 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Play Against Computer
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg text-white mb-3">Choose Your Color:</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-white text-black py-4 rounded-lg border-2 border-transparent hover:border-blue-500 transition-colors flex items-center justify-center"
                  onClick={() => setPlayerColor('white')}
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-300 mr-2"></div>
                  White
                </button>
                <button
                  className="bg-gray-800 text-white py-4 rounded-lg border-2 border-transparent hover:border-blue-500 transition-colors flex items-center justify-center"
                  onClick={() => setPlayerColor('black')}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 mr-2"></div>
                  Black
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg text-white mb-3">Difficulty Level:</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`py-3 rounded-lg border transition-colors ${
                    selectedDifficulty === 'easy'
                      ? 'bg-green-600 text-white border-green-500'
                      : 'bg-slate-600 text-white border-transparent hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedDifficulty('easy')}
                >
                  Easy
                </button>
                <button
                  className={`py-3 rounded-lg border transition-colors ${
                    selectedDifficulty === 'medium'
                      ? 'bg-yellow-600 text-white border-yellow-500'
                      : 'bg-slate-600 text-white border-transparent hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedDifficulty('medium')}
                >
                  Medium
                </button>
                <button
                  className={`py-3 rounded-lg border transition-colors ${
                    selectedDifficulty === 'hard'
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-slate-600 text-white border-transparent hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedDifficulty('hard')}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <Button
              varient="primary"
              size="lg"
              text="Start Game"
              onClick={() => {
                startGame(selectedColor, selectedDifficulty);
                setShowGameOptions(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-center flex min-h-screen bg-slate-800">
      {/* Winner announcement overlay */}
      {winner && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-700 p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">
              {winner === "draw"
                ? "Game Draw!"
                : `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`}
            </h2>
            <p className="text-white mb-6">{gameStatus}</p>
            <div className="space-x-4">
              <Button
                varient="primary"
                size="lg"
                text="New Game"
                onClick={() => {
                  resetGame();
                  setShowGameOptions(true);
                }}
              />
              <Button
                varient="secondary"
                size="lg"
                text="Rematch"
                onClick={() => {
                  startGame(playerColor, difficulty);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error message toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {errorMessage}
        </div>
      )}

      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
          <div className="md:col-span-4 w-full flex justify-center">
            {/* Chess board component */}
            <ChessBoard
              chess={chess}
              board={board}
              playerColor={playerColor}
              currentTurn={currentTurn}
              makeMove={makeMove}
              lastMove={lastMove}
              isCheck={isCheck}
            />
            
            {/* Computer is thinking indicator */}
            {isComputerThinking && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-10">
                Computer is thinking...
              </div>
            )}
          </div>
          <div className="md:col-span-2 bg-slate-900 p-6 rounded-lg w-full flex flex-col">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-4">
                Game Status
              </h2>

              <div className="text-white space-y-4">
                <div className="bg-slate-800 p-4 rounded">
                  <p
                    className={`text-lg ${
                      isCheck && !winner
                        ? "text-red-500 font-bold animate-pulse"
                        : ""
                    }`}
                  >
                    {gameStatus || "Game in progress"}
                  </p>

                  <div className="mt-4 flex items-center">
                    <span className="mr-2">You are playing as:</span>
                    <span
                      className={`font-bold px-2 py-1 rounded ${
                        playerColor === "white"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {playerColor || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center">
                    <span className="mr-2">Current turn:</span>
                    <span
                      className={`font-bold px-2 py-1 rounded ${
                        currentTurn === "white"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {currentTurn}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <span className="mr-2">Difficulty:</span>
                    <span className={`font-bold px-2 py-1 rounded ${
                      difficulty === 'easy' 
                        ? 'bg-green-600 text-white'
                        : difficulty === 'medium'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                    }`}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Player/Computer info */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`p-2 rounded ${
                      playerColor === "white"
                        ? "bg-white text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    White
                    {playerColor === "white" && (
                      <span className="ml-2">(You)</span>
                    )}
                    {playerColor === "black" && (
                      <span className="ml-2">(Computer)</span>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded ${
                      playerColor === "black"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    Black
                    {playerColor === "black" && (
                      <span className="ml-2">(You)</span>
                    )}
                    {playerColor === "white" && (
                      <span className="ml-2">(Computer)</span>
                    )}
                  </div>
                </div>

                {/* Game controls */}
                <div className="mt-6 space-y-2">
                  <Button
                    varient="primary"
                    size="sm"
                    text="New Game"
                    onClick={() => {
                      resetGame();
                      setShowGameOptions(true);
                    }}
                  />
                  
                  {/* Change difficulty dropdown */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Change Difficulty
                    </label>
                    <select
                      className="bg-slate-700 text-white rounded p-2 w-full border border-gray-600"
                      value={difficulty}
                      onChange={(e) => {
                        changeDifficulty(e.target.value as DifficultyLevel);
                      }}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};