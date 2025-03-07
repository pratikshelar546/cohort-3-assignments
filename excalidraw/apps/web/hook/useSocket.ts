import { useEffect, useState } from "react";
import { WS_URL } from "../config/config";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket,setSocket]= useState<WebSocket>();

    useEffect(()=>{
const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNmQ1MGQ5NC1jY2JmLTRhMTMtOTBmMy1jZjk2ZThjYmUxMzQiLCJpYXQiOjE3Mzk3NDA5OTN9.fcq_Q3jahh4CG0gN7DXG_OWgXjvimZYNhVp-CzL3t6A`);
ws.onopen = ()=>{
    setLoading(false);
    setSocket(ws);
}
    },[])

    return {
        socket, loading
    }
}