import { Game } from './game';
import { WebSocket } from 'ws'; 

export class GameManager {
    private games: Game[]=[];
    private pendingUser:WebSocket | null;
    private users:WebSocket[];


    constructor(){
        this.games =[];
        this.pendingUser = null;
        this.users = [];

    }
    addUser(socket:WebSocket){
        this.users.push(socket);
    }
    removeUser(socket:WebSocket){
        this.users = this.users.filter(s=>s!==socket);

    }
    private handleMessage(socket: WebSocket, message: string) {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data.toString());
            if (data.type === INIT_GAME) {
                if(this.pendingUser){
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket;
                }
            }
            if(data.type === MOVE){
                const game = this.games.find(g=>g.player1 === socket || g.player2 === socket);
                if(game){
                    game.makeMove(socket, data.move);
                }
            }
        };
    }

}