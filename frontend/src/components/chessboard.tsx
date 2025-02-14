import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from '../pages/game';


const pieceImages: { [key: string]: string } = {
    'P': '/src/assets/P .png',  // White Pawn
    'p': '/src/assets/p.png',  // Black Pawn
    'R': '/src/assets/R .png',  // White Rook
    'r': '/src/assets/r.png',  // Black Rook
    'K': '/src/assets/K .png',  // White Knight
    'k': '/src/assets/k.png',  // Black Knight
    'B': '/src/assets/B .png',  // White Bishop
    'b': '/src/assets/b.png',  // Black Bishop
    'Q': '/src/assets/Q .png',  // White Queen
    'q': '/src/assets/q.png',  // Black Queen
    'Ki': '/src/assets/Ki .png',  // White King
    'ki': '/src/assets/ki.png',  // Black King
};

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: Chess;
    setBoard: React.Dispatch<React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>>;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket | null;
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    
    return <div className="text-white-200">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                    return <div onClick={() => {
                        if (!from) {
                            setFrom(squareRepresentation);
                        } else {
                            socket && socket.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    move: {
                                        from,
                                        to: squareRepresentation
                                    }
                                }
                            }))
                            
                            setFrom(null)
                            chess.move({
                                from,
                                to: squareRepresentation
                            });
                            setBoard(chess.board());
                            console.log({
                                from,
                                to: squareRepresentation
                            })
                        }
                    }} key={j} className={`w-16 h-16 ${(i+j)%2 === 0 ? 'bg-green-500' : 'bg-slate-500'}`}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                            {square ? (
            <img
              className="w-4"
              src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} `}.png`}
              alt={square?.type}
            />
          ) : null}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}