// In usesocket.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const WS_URL = 'ws://localhost:8080';

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { userId, getToken } = useAuth();
  
  useEffect(() => {
    const connectWebSocket = async () => {
      if (!userId) return;
      
      const token = await getToken();
      

      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setSocket(ws);
        

        ws.send(JSON.stringify({
          type: 'AUTH',
          payload: {
            userId,
            token
          }
        }));
      };
      
      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        setSocket(null);
      };
      
      return () => {
        ws.close();
      };
    };
    
    connectWebSocket();
  }, [userId, getToken]);
  
  return socket;
};