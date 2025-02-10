import {WebSocket} from 'ws';
import {Chess} from 'chess.js';
export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    private board:Chess;
    private moves:string[];
    private currentPlayer:WebSocket;
    private gameOver:boolean;
    private winner:WebSocket;
    private starttime:Date;


    constructor(player1:WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.currentPlayer = player1;
        this.gameOver = false;
        this.winner = null;
        this.starttime = new Date();

    }
    makemove(socket:WebSocket, move:{
        from:string,
        to:string,
        promotion:string
    }){
        if(this.gameOver){
            return;
        }
        if(socket !== this.currentPlayer){
            return;
        }
        if(this.board.move.length%2 === 0 && socket!== this.player1){
            return;
        }
        if(this.board.move.length%2 === 1 && socket!== this.player2){
            return;
        }
        try{
            this.board.move(move);
        }
        catch(e){
            return;
        }
        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type:GAME_OVER
            }))
            return;
        }
        
    }
}