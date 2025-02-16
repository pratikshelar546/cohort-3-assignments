"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Home() {
  const [roomSlug, setRoomSlug] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw"
    }}>
      <input type="text" value={roomSlug} onChange={(e) => setRoomSlug(e.target.value)} placeholder="enter room name" style={{ padding: 10 }} />
      <button style={{ padding: 10 }} onClick={() => router.push(`/room/${roomSlug}`)}>Join room</button>
    </div>
  );
}
