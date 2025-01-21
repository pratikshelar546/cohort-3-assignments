import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-comman/config';

const app = express();

app.use(express.json());

app.use("/sigin", (req, res) => {

})

app.use("/signup", (req, res) => {

    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET)
    res.json({ token })

})

app.use("/createRoom", (req, res) => {

})
app.listen(3001);