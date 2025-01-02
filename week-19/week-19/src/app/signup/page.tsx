"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    
    return (
        <div className="flex flex-col h-full w-full gap-3 justify-center items-center">
            <input type="text" placeholder="Name" className="p-2" onChange={e => { setUser(e.target.value) }} />
            <input type="password" placeholder="Password" className="p-2" onChange={e => { setPassword(e.target.value) }} />

            <button onClick={async () => {
                await axios.post("/api/v1/details", { user, password })
                router.push("/signin")

            }}>Sign up</button>
        </div>
    )
}

