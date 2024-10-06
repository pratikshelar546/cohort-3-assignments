const express = require("express");
const { userModel } = require("../database/db");
const { userValidation } = require("../validation/validation");
const { z } = require("zod");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/userMiddleware");
userRouter.post("/signup", async (req, res,) => {
    const validation = userValidation(req, res);
    if (validation) return;
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    try {
        const userExist = await userModel.findOne({ email });
        if (userExist) return res.status(400).json({ message: "user already exist" })
        const response = await userModel.create({
            email: email,
            password: hashedPassword,
            name: name
        })
        const token = await response.genrateJwtToken();
        res.status(200).json({ message: "You have signup", data: token })
    } catch (error) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
})
userRouter.post("/signin", async (req, res) => {
    const validation = userValidation(req, res);
    if (validation) return;
    try {
        const { email, password } = req.body;
        const userExist = await userModel.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "user not found" });
        const passwordMatch = await bcrypt.compare(password, userExist.password)
        const token = userExist.genrateJwtToken();
        if (!passwordMatch) return res.status(404).json({ message: "Invalid credentials" });
        res.status(200).json({ token })
    } catch (error) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
})
userRouter.post("/", auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        res.status(200).json({ user })
    } catch (error) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
})
module.exports = {
    userRouter: userRouter
}