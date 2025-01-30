import express from "express";
import { middleware } from "./middleware/middleware";
import { prismaClient } from "@repo/database/client";
import { CreateUSerSchema } from '@repo/comman/types';

const app = express();

app.use(express.json());

app.use("/sigin", (req, res) => { });

app.use("/signup",async (req, res) => {
    try {
        const parseData = CreateUSerSchema.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({ message: "Invalid input" });
            return;
        }
        const addUser =await prismaClient.user.create({
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

app.use("/createRoom", middleware, (req, res) => {
    res.json({
        roomId: 123,
    });
});
app.listen(3001);
