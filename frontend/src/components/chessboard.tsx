import { Color, PieceSymbol, Square } from 'chess.js';
import { useState } from 'react';
import { MOVE } from '../pages/game';

export const ChessBoard = ({board, socket}:{
    board:({
        square:Square;
        type: PieceSymbol;
        color:Color;
    } | null)[][];
    socket:WebSocket | null;
}) =>{
    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null|Square>(null);

    const handleSquareClick = (square: Square | null) => {
        if (!from) {
            setFrom(square);
        } else {
            setTo(square);
            if (socket && from && square) {
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: {
                        from,
                        to: square
                    }
                }));
                setFrom(null);
                setTo(null);
            }
        }
    };

    return (
        <div className=''>
            <div className='grid grid-cols-8 gap-0'>
                {board.map((row, i) => (
                    row.map((square, j) => (
                        <div onClick={() => handleSquareClick(square?.square ?? null)} key={`${i}-${j}`} className={`h-16 w-16 flex justify-center items-center ${((i + j) % 2 === 0) ? 'bg-green-400' : 'bg-white'}`}>
                            {square?.type}
                        </div>
                    ))
                ))}
            </div>
        </div>
    )
}