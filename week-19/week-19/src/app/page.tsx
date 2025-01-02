import { PrismaClient } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
const client = new PrismaClient();
async function getDeatils() {
  const user = await client.user.findFirst();
  console.log(user);

  return user;
}

export default async function Home() {
  const userData = await getDeatils();

  const response = await axios.get("http://localhost:3000/api/v1/details")
  const data = response.data;
  return (
    <div className="w-screen h-screen flex items-center flex-col justify-center">
      <h1>Todo Application</h1>
      <h1>user: {userData?.username}</h1>
      <h3> hi {data.user}</h3>
      <Link href="/signup">Sign up</Link>
      <Link href="/signin">Sign in</Link>
    </div>
  );
}
