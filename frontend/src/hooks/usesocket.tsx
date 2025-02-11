import { useState } from "react"
import { useEffect } from "react"

const WS_URL = 'ws://localhost:8080';
export const useSocket = () =>{
    const [Socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = () =>{
            console.log('connected');
            setSocket(ws);
        }
        ws.onclose = ()=>{
            console.log('disconnected');
            setSocket(null);
        }
        return ()=>{
            ws.close();
        }
    })
    return Socket;
}