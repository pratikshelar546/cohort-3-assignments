import express from "express";
import { middleware } from "./middleware/middleware";
import { prismaClient } from "@repo/database/client";
import { CreateRoomSchema, CreateUSerSchema, SignInSchema } from '@repo/comman/types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-comman/config";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors())
app.use("/signin", async (req, res) => {
    try {
        const parseData = SignInSchema.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({
                message: "Inavlid data"
            })
            return
        }
        const ExistUser = await prismaClient.user.findFirst({
            where: {
                AND: [

                    { name: parseData.data.name }, { password: parseData.data.password }
                ]
            }
        })
        if (ExistUser === null) {
            res.status(400).json({
                message: "Invalid credentials",
                success: false
            })
            return
        }

        const token = jwt.sign({
            userId: ExistUser?.id,
        }, JWT_SECRET)
        res.status(200).json({
            message: "user",
            token: token
        })
        return
    } catch (error) {
        console.log("error", error);
        res.status(400).json({
            error,
        });
        return;
    }
});

app.use("/signup", async (req, res) => {
    try {
        const parseData = CreateUSerSchema.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({ message: "Invalid input" });
            return;
        }
        const addUser = await prismaClient.user.create({
            data: {
                name: parseData.data.name,
                password: parseData.data.password,
                email: parseData.data.email,
            },
        });

        // const addUser = await 
        console.log(addUser, "added new user");
        res.status(200).json({
            message: "user added",
            success: true,
            user: addUser,
        });
        return;
    } catch (error) {
        console.log("error", error);
        res.status(400).json({
            error,
        });
        return;
    }
});

app.use("/createRoom", middleware, async (req, res) => {
    console.log("hit");

    const parseData = CreateRoomSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(400).json({
            message: "Data invalid"
        })
        return
    }
    // @ts-ignore
    const userId = req.userId;

    try {
        const createRoom = await prismaClient.room.create({
            data: {
                slug: parseData.data?.name,
                adminId: userId
            }
        })

console.log(createRoom);

        res.status(200).json({
            message: "room created",
            roomId: createRoom.id
        })
        return

    } catch (error) {
        console.log("error", error);
        res.status(411).json({
            message: "room already exits with that"
        })
        return
    }
});


app.get("/chat/:roomId", async (req, res) => {

    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chats.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    res.status(200).json({
        message: "all mesaage",
        messages: messages
    })
})

app.get("/room/:slug", async (req, res) => {

    try {

        const slug = req.params.slug;
        console.log(slug);

        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug
            }
        })
        console.log(room, "this is rooom");


        res.status(200).json({
            message: "room details",
            data: room
        })
        return
    } catch (error) {
        res.status(500).json({
            error
        })
        return
    }
})
app.listen(5001);
