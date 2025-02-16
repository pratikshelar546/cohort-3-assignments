import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { ChatRoomClient } from "./ChatRoomClient";


async function getChatsByRoom(id: string) {
    try {

        const response = await axios.get(`${BACKEND_URL}/chat/${id}`)
        return response.data.messages
    } catch (error) {
        console.log(error);

    }
}

export async function Chats({ id }: { id: string }) {
    const messages = await getChatsByRoom(id);
    return <ChatRoomClient messages={messages} id={id} />
}