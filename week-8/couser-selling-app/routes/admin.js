const express = require("express");
const { adminModel } = require("../database/db");
const { userValidation } = require("../validation/validation");
const adminRouter = express.Router();
const bcrypt = require("bcrypt");

adminRouter.post("/signup", async (req, res) => {
    const validation = userValidation(req, res);
    if (validation) return

    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        const adminexist = await adminModel.findOne({ email });
        if (adminexist) return res.status(400).json({ message: "Admin already exist" });

        const admin = await adminModel.create({
            email: email,
            password: hashedPassword,
            name: name
        })
        const token = admin.genrateJwtToken();

        return res.status(202).json({ token })
    } catch (error) {
        return res.status(404).json({ message: "Something went wrong" })
    }
})

adminRouter.post("/signin", async (req, res) => {
    const validation = userValidation(req, res);
    if (validation) return

    try {
        const { email, password } = req.body

        const adminExist = await adminModel.findOne({ email });
        if (!adminExist) return res.status(404).json({ message: "Admin not found" })

        const passwordMatch = bcrypt.compare(password, adminExist.password)
        if (!passwordMatch) return res.status(400).json({ message: "Invalid credemtials" });

        const token = adminExist.genrateJwtToken();
        return res.status(202).json({ token })

    } catch (error) {
        return res.status(404).json({ message: "Something went wrong" })
    }
})


module.exports = {
    adminRouter
}