import { useEffect } from "react";
import { Button } from "../ui/button";
import { ChessBoard } from "../components/chessboard";
import { useChessGame } from "../hooks/useChessGame";

export const Game = () => {
  const {
    socket,
    chess,
    board,
    gameStarted,
    playerColor,
    currentTurn,
    gameStatus,
    errorMessage,
    isCheck,
    winner,
    initGame,
    makeMove,
    resetGame,
  } = useChessGame();

  // Show a notification when a check occurs
  useEffect(() => {
    if (isCheck && !winner) {
      const checkSound = new Audio("/sounds/check.mp3");
      checkSound.volume = 0.5;
      checkSound.play().catch((e) => console.log("Error playing sound:", e));
    }
  }, [isCheck, winner]);

  // Handle board animation and player connection
  useEffect(() => {
    if (!socket && gameStarted) {
      // Lost connection during a game
      resetGame();
    }
  }, [socket, gameStarted, resetGame]);

  if (!socket) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-800">
        <div className="bg-slate-700 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl text-white mb-4">Connecting to server...</h2>
          <div className="animate-pulse bg-blue-500 h-2 w-64 rounded"></div>
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
            <Button
              varient="primary"
              size="lg"
              text="New Game"
              onClick={() => {
                resetGame();
                // Wait a moment for the reset to complete
                setTimeout(initGame, 500);
              }}
            />
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
              lastMove={null}
              isCheck={isCheck}
            />
          </div>
          <div className="md:col-span-2 bg-slate-900 p-6 rounded-lg w-full flex flex-col">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-4">
                Game Status
              </h2>

              {!gameStarted ? (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Welcome to Chess! Click the button below to find a match.
                  </p>
                  <Button
                    varient="secondary"
                    size="lg"
                    text="Find Match"
                    onClick={initGame}
                  />
                </div>
              ) : (
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
                  </div>

                  {/* Player info */}
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
                    </div>
                  </div>

                  {/* Game controls */}
                  <div className="mt-6 space-y-2">
                    <Button
                      varient="primary"
                      size="sm"
                      text="Resign"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to resign?")
                        ) {
                          socket.send(
                            JSON.stringify({
                              type: "RESIGN",
                            })
                          );
                        }
                      }}
                    />

                    <Button
                      varient="secondary"
                      size="sm"
                      text="Offer Draw"
                      onClick={() => {
                        socket.send(
                          JSON.stringify({
                            type: "DRAW_OFFER",
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
