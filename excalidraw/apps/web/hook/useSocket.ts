import { useEffect, useState } from "react";
import { WS_URL } from "../config/config";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket,setSocket]= useState<WebSocket>();

    useEffect(()=>{
const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWNhMzJiMi1jZmI1LTRkMTItYTRjMC1lZDdlZTY4YzE5ZWEiLCJpYXQiOjE3Mzk2OTEzNTB9.SyNKZkbqqHJlXGWcLd0SwLNDM0_FUXVF4ZKr3rF0oJM`);
ws.onopen = ()=>{
    setLoading(false);
    setSocket(ws);
}
    },[])

    return {
        socket, loading
    }
}