"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hook/useSocket"

export function ChatRoomClient({ messages, id }: {
    messages: { message: string }[],
    id: string
}) {
    const { socket, loading } = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (event) => {
                const parseData = JSON.parse(event.data)

                if (parseData.type === "chat") {
                    setChats(c => [...c, parseData])
                }
            }
        }
    }, [socket, loading, id])

    return (<div>
        {chats?.map((m, index) => {
            console.log(m);

            return <div key={index}>{m?.message}</div>
        }
        )}
        <input type="text" placeholder="message" value={currentMessage} onChange={(e) => {
            setCurrentMessage(e.target.value)
        }} />
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }));
        }}>Send</button>
    </div>

)
}    