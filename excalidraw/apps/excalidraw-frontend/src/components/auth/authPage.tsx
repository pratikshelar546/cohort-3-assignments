"use client";
import TextField from "@repo/ui/textField";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";


export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
    const [data, setData] = useState({
        name: "",
        password: "",
    });

    const handleSignIn = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/signin`, data)
            console.log(response.data.token);

            if (!response) return <div>Sorry somthing went swrong</div>;
            localStorage.setItem("token", response.data.token)
        } catch (error) {
            console.log(error);

        }
    };
    console.log(data);


    return (
        <div className="w-screen h-screen justify-center items-center flex">
            <div className="p-2 m-2  rounded flex flex-col gap-4 ">
                <h3 className=" text-xl font-semibold text-blue-500">{isSignIn ? "Sign In" : "Sign Up"} to draw your feature</h3>
                <TextField
                    type="text"
                    placeholder="Enter username"
                    className="border-none text-black bg-white p-2 rounded outline-none"
                    value={data.name}
                    onChange={(e) =>
                        setData((data) => ({ ...data, name: e.target.value }))
                    }
                />
                <TextField
                    type="password"
                    placeholder="Enter Password"
                    className="border-none text-black bg-white p-2 rounded outline-none "
                    value={data.password}
                    onChange={(e) =>
                        setData((data) => ({ ...data, password: e.target.value }))
                    }
                />

                <Button
                    onClick={() => handleSignIn()}
                    variant="secondary"
                    size="md"
                >
                    {isSignIn ? "Sign In" : "Sign up"}
                </Button>
            </div>
        </div>
    );
}
