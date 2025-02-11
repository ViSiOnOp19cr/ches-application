import { useEffect,useState } from 'react';

import { ChessBoard } from '../components/chessboard'
import { useSocket } from '../hooks/usesocket'
import { Button } from '../ui/button'
import {Chess} from 'chess.js'

export const GAME_OVER = 'GAME_OVER';
export const INIT_GAME = 'init_game';
export const MOVE = 'move';


export const Game = () =>{
    const Socket = useSocket();
    const [chess,setChess] = useState(new Chess());
    const [board,setBoard] = useState(chess.board());

    useEffect(() => {
        if (!Socket) return;
    
        const handleMessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            console.log(message);
            setChess(prevChess => {
                const updatedChess = new Chess(prevChess.fen()); // Preserve state
                switch (message.type) {
                    case INIT_GAME:
                        updatedChess.reset();
                        setBoard(updatedChess.board());
                        break;
                    case GAME_OVER:
                        alert('Game Over');
                        break;
                    case MOVE:
                        updatedChess.move(message.payload);
                        setBoard(updatedChess.board());
                        console.log('Move made');
                        break;
                }
                return updatedChess;
            });
        };
    
        Socket.addEventListener('message', handleMessage);
    
        return () => {
            Socket.removeEventListener('message', handleMessage); // Clean up to avoid duplicate listeners
        };
    }, [Socket]);

    return(
        <div className='justify-center flex'>
            <div className='pt-8 max-w-screen-lg f'>
                <div className="grid grid-cols-6 gap-4">
                    <div className='col-span-4 bg-red-200'>
                        <ChessBoard socket={Socket} board={board}/>
                    </div>
                    <div className='col-span-2 bg-slate-800 flex justify-center'>
                        <div className='pt-12'><Button varient='primary' text='play' size='lg' 
                        onClick={() => Socket && Socket.send(JSON.stringify({
                            type:   INIT_GAME,  
                        }))}
                        />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}