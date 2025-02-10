import { Game } from './game';
import { WebSocket } from 'ws'; 
import { INIT_GAME, MOVE } from './message';

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
        console.log('added user');
        this.users.push(socket);
        this.handleMessage(socket, '');
    }
    removeUser(socket:WebSocket){
        this.users = this.users.filter(s=>s!==socket);

    }
    private handleMessage(socket: WebSocket, message: string) {
        console.log("inside handler");
        socket.onmessage = (event) => {
            console.log('inside onmessage');
            console.log(event.data);
            const message = JSON.parse(event.data.toString());
            console.log("message is "+message);
            if (message.type === INIT_GAME) {
                if(this.pendingUser){
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else{
                    console.log('pending user');
                    this.pendingUser = socket;
                }
            }
            if(message.type === MOVE){
                const game = this.games.find(g=>g.player1 === socket || g.player2 === socket);
                if(game){
                    console.log('making move');
                    console.log(message.move);
                    game.makeMove(socket, message.move);
                }
            }
        };
    }

}