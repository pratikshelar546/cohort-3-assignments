import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
export function GET() {
    return NextResponse.json({
        user: "pratik"
    })
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    console.log(data);
    const res = await prismaClient.user.create({ data: { username: data.user, password: data.password } })

    console.log(res);

    return NextResponse.json({ message: "Sigin ui" })
}