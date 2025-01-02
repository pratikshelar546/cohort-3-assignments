"use client";

import axios from "axios";
import { useState } from "react";

export default function Signin() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col h-full w-full gap-3 justify-center items-center">
            {/* <h1>Sign in with todo </h1> */}
            <input type="text" placeholder="Name" className="p-2" onChange={e => { setUser(e.target.value) }} />
            <input type="password" placeholder="Password" className="p-2" onChange={e => { setPassword(e.target.value) }} />

            <button onClick={async () => {
                await axios.post("/api/v1/details", { user, password });
            }}>Sign up</button>
        </div>
    )
}

