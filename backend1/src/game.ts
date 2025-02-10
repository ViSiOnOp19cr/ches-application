import {WebSocket} from 'ws';
import {Chess,Move , Square} from 'chess.js';
import {INIT_GAME, MOVE, GAME_OVER} from './message';
export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    private board:Chess;
    private movesCount:number;
    private currentPlayer:WebSocket;
    private gameOver:boolean;
    private winner:WebSocket | null;
    private starttime:Date;


    constructor(player1:WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.movesCount = 0;
        this.currentPlayer = player1;
        this.gameOver = false;
        this.winner = null;
        this.starttime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:'w',
                board:this.board.fen()
            }
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:'b',
                board:this.board.fen()
            }
        }))

    }
    makeMove(socket:WebSocket, move:{
        from:string,
        to:string
    }){
        console.log("make move function indie")
        console.log(this.board.move.length);
        console.log(this.board.moves().length);
        
        if(this.gameOver){
            return;
        }
        if(this.currentPlayer !== socket){
            return;
        }
        
        if(socket !== this.currentPlayer){
            console.log("not current player");
            return;
        }
        if(this.movesCount %2 === 0 && socket!== this.player1){
            console.log("not player1");
            return;
        }
        if(this.movesCount%2 === 1 && socket!== this.player2){
            console.log("not player2");
            return;
        }
        try{
            this.board.move(move);
        }
        catch(e){
            return;
        }
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === 'w' ? this.player2 : this.player1,
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === 'w' ? this.player2 : this.player1,
                }
            }))
            return;
        }
        console.log(this.board.moves().length+"this is second sonsoile");
        if(this.movesCount % 2 === 0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move:move
                }
            }))
            this.currentPlayer = this.player2;
            this.movesCount++;
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move:move
                }
            }))
            this.currentPlayer = this.player1;
            this.movesCount++;
        }
        
    }
}