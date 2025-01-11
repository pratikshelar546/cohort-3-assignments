"use client"
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
const client = new PrismaClient();

export default function Home() {
  return (
    <SessionProvider>

      <Main />
    </SessionProvider>
  );
}

function Main() {
  const session = useSession();



  return (

    <div className="w-screen h-screen flex items-center flex-col justify-center">
      <h1>Todo Application</h1>
      helo
      {session.status === "authenticated" && <button onClick={() => signOut()}>Logout</button>}
      {session.status === "unauthenticated" && <button onClick={() => signIn()}>Sign in</button>}
    </div>
  )
}