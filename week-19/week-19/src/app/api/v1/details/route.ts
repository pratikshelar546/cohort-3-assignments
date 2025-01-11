import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
export async function GET() {
   const res = await prismaClient.user.findMany();
return NextResponse.json({message:"All data", res})

}

export async function POST(req: NextRequest) {
    const data = await req.json();

    const res = await prismaClient.user.create({ data: { username: data.user, password: data.password } })

    return NextResponse.json({ message: "Sigin ui",res })
}