import express from "express";
import { middleware } from "./middleware/middleware";
import { prismaClient } from "@repo/database/client";
import { CreateRoomSchema, CreateUSerSchema, SignInSchema } from '@repo/comman/types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-comman/config";

const app = express();

app.use(express.json());

app.use("/signin", async (req, res) => {
    try {
        const parseData = SignInSchema.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({
                message: "Inavlid data"
            })
            return
        }
        const ExistUser = await prismaClient.user.findFirst({ where:{
            name: parseData.data.name, password: parseData.data.password
        } })
        console.log(ExistUser);
        const token = jwt.sign({
            userId:ExistUser?.id,
        },JWT_SECRET)
        res.status(200).json({
            message: "user",
            data: token
        })

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

app.use("/createRoom", middleware,async (req, res) => {
try {
    const parseData = CreateRoomSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({
            message:"Data invalid"
        })
        return
    }
    // @ts-ignore
    const userId = req.userId;

    const createRoom = await prismaClient.room.create({
        data:{
            slug:parseData.data?.name,
            adminId:userId
        }
    })

    res.status(200).json({
        message:"room created",
        roomId:createRoom.id
    })
} catch (error) {
    console.log("error", error);
    res.status(411).json({
        error
    })
    
}
});
app.listen(3001);
