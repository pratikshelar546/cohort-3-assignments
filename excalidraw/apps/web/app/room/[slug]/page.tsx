import axios from "axios";
import { BACKEND_URL } from "../../../config/config";
import { Chats } from "../../../components/Chats";

async function getRoomId(slug: string) {
    try {
        const respose = await axios.get(`${BACKEND_URL}/room/${slug}`)
        console.log(respose);
        
        return respose.data.data.id
    } catch (error) {
        console.log(error);

    }
}

export default async function ChatRoom({
    params
}: {
    params: {
        slug: string
    }
}) {

    const slug = (await params).slug;
    console.log(slug);

    const roomId = await getRoomId(slug);
    console.log("here", roomId);

    return (
        <Chats id={roomId}></Chats>
    )
} 