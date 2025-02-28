import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
import { ChessPiece } from "./chessPeice";

interface ChessBoardProps {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  playerColor: "white" | "black" | null;
  currentTurn: "white" | "black";
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  lastMove: { from: string; to: string } | null;
  isCheck: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  board,
  playerColor,
  currentTurn,
  makeMove,
  lastMove,
  isCheck,
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [boardRotated, setBoardRotated] = useState(false);

  // Check if we should rotate the board based on player color
  useEffect(() => {
    setBoardRotated(playerColor === "black");
  }, [playerColor]);

  // Calculate king position for check highlight
  const getKingPosition = () => {
    if (!isCheck) return null;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (
          piece &&
          piece.type === "k" &&
          piece.color === (currentTurn === "white" ? "w" : "b")
        ) {
          return String.fromCharCode(97 + j) + (8 - i);
        }
      }
    }
    return null;
  };

  const kingInCheckPosition = getKingPosition();

  const handleSquareClick = (squareRepresentation: string) => {
    // Get current player's color in chess.js format
    const playerColorCode = playerColor === "white" ? "w" : "b";
    const currentTurnCode = currentTurn === "white" ? "w" : "b";

    // Check if it's the player's turn
    if (playerColor !== currentTurn) {
      console.log(
        `Not your turn. Current turn: ${currentTurn}, Your color: ${playerColor}`
      );
      return;
    }

    if (!from) {
      // First click - select a piece
      const piece = chess.get(squareRepresentation as Square);

      if (piece) {
        // Check if player is trying to move their own piece
        if (piece.color !== playerColorCode) {
          console.log(
            `Cannot select opponent's piece. Piece color: ${piece.color}, Your color: ${playerColorCode}`
          );
          return;
        }

        // Calculate valid moves
        const legalMoves = chess.moves({
          square: squareRepresentation as Square,
          verbose: true,
        });

        // Extract destination squares
        const validDestinations = legalMoves.map((move) => move.to);

        setFrom(squareRepresentation);
        setSelectedSquare(squareRepresentation);
        setValidMoves(validDestinations);
        console.log(
          `Selected ${piece.color} ${piece.type} at ${squareRepresentation}`
        );
      }
    } else if (from === squareRepresentation) {
      // Clicked the same square twice - deselect
      setFrom(null);
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Second click - attempt to move
      const result = makeMove(from, squareRepresentation);

      // Reset selection regardless of move validity
      setFrom(null);
      setSelectedSquare(null);
      setValidMoves([]);

      if (result) {
        console.log(`Move successful: ${from} to ${squareRepresentation}`);
      }
    }
  };

  // Determine if a square is a potential destination for the selected piece
  const isValidMoveTarget = (square: string) => {
    return validMoves.includes(square);
  };

  // Determine if a square is the last move's source or destination
  const isLastMoveSquare = (square: string) => {
    return lastMove && (lastMove.from === square || lastMove.to === square);
  };

  // Determine if a square contains the king in check
  const isKingInCheck = (square: string) => {
    return isCheck && square === kingInCheckPosition;
  };

  // Rotate board for black player
  const rotateBoard = (array: any[][]) => {
    if (!boardRotated) return array;

    // Create a deep copy of the array
    const rotated = JSON.parse(JSON.stringify(array));
    // Reverse rows and columns
    return rotated
      .slice()
      .reverse()
      .map((row: any[]) => row.slice().reverse());
  };

  const rotatedBoard = rotateBoard(board);

  return (
    <div className="relative">
      <div className="text-white-200 border-2 border-gray-700 select-none rounded overflow-hidden">
        {rotatedBoard.map((row: any, i: any) => (
          <div key={i} className="flex">
            {row.map((square: any, j: any) => {
              const rowIndex = boardRotated ? 7 - i : i;
              const colIndex = boardRotated ? 7 - j : j;
              const squareRepresentation =
                String.fromCharCode(97 + colIndex) + (8 - rowIndex);

              const isSelected = selectedSquare === squareRepresentation;
              const isValidTarget = isValidMoveTarget(squareRepresentation);
              const isInLastMove = isLastMoveSquare(squareRepresentation);
              const isKingCheck = isKingInCheck(squareRepresentation);

              return (
                <div
                  onClick={() => handleSquareClick(squareRepresentation)}
                  key={j}
                  className={`w-16 h-16 flex items-center justify-center relative
                                        ${
                                          (rowIndex + colIndex) % 2 === 0
                                            ? "bg-green-700"
                                            : "bg-slate-200"
                                        }
                                        ${
                                          isSelected
                                            ? "ring-2 ring-yellow-400"
                                            : ""
                                        }
                                        ${isValidTarget ? "cursor-pointer" : ""}
                                        ${
                                          isInLastMove
                                            ? "bg-yellow-100 bg-opacity-30"
                                            : ""
                                        }
                                        ${
                                          isKingCheck
                                            ? "bg-red-500 bg-opacity-50"
                                            : ""
                                        }
                                        transition-colors duration-150`}
                >
                  {/* Rank/file notation */}
                  {j === 0 && (
                    <div className="absolute left-1 top-1 text-xs font-bold">
                      {boardRotated ? i + 1 : 8 - i}
                    </div>
                  )}
                  {i === 7 && (
                    <div className="absolute right-1 bottom-1 text-xs font-bold">
                      {boardRotated
                        ? String.fromCharCode(104 - j)
                        : String.fromCharCode(97 + j)}
                    </div>
                  )}

                  {/* Valid move indicator */}
                  {isValidTarget && !square && (
                    <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-60"></div>
                  )}

                  {/* Capture indicator */}
                  {isValidTarget && square && (
                    <div className="absolute w-full h-full ring-2 ring-yellow-400 opacity-60"></div>
                  )}

                  {/* Chess piece */}
                  {square && (
                    <div className={`${isValidTarget ? "cursor-pointer" : ""}`}>
                      <ChessPiece
                        type={square.type}
                        color={square.color}
                        size={40}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Turn indicator */}
      <div
        className={`absolute -bottom-8 left-0 right-0 flex justify-center ${
          currentTurn === playerColor ? "text-green-400" : "text-gray-300"
        }`}
      >
        {playerColor === currentTurn
          ? "Your turn"
          : `Waiting for ${currentTurn}'s move...`}
      </div>
    </div>
  );
};
