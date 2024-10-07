const { Router } = require("express");
const { adminModel, courseModel } = require("../database/db");
const { authAdmin } = require("../middleware/adminMiddleWare");

const courseRouter = Router();

courseRouter.get("/", async (req, res) => {
    try {
        const courses = await courseModel.find();

        return res.status(200).json({ courses })
    } catch (error) {
        res.status(400).json({ message: "something went srong" })
    }
})

courseRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const course = await courseModel.findById(id);
        if (!course) return res.status(404).json({ message: "Course dose not exist" })
        return res.status(200).json({ course })
    } catch (error) {
        res.status(400).json({ message: "something went srong" })

    }
})

courseRouter.post("/upload", authAdmin, async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price, imageUrl } = req.body

    try {
        const adminExist = await adminModel.findById(adminId);
        if (!adminExist) return res.status(404).json({ message: "admin not found" });

        const course = await courseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorId: adminId
        })

        return res.status(202).json({ message: "Course added", data: course })
    } catch (error) {
        res.status(400).json({ message: "somthing went wrong" })
    }
})

courseRouter.delete("/delete/:id", authAdmin, async (req, res) => {
    const { id } = req.params;
    const adminId = req.adminId
    try {
        const coursexist = await courseModel.findById(id);
        if (!coursexist) return res.status(404).json({ message: "course not found" })

        // check creator can only delete 
        if (adminId == coursexist.creatorId.toString()) {

            await courseModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Course has been deleted successfully" })

        } else {

            return res.status(400).json({ message: "Only creator of this course can delete it" })
        }

    } catch (error) {
        res.status(400).json({ message: "something went srong" })

    }
})

courseRouter.put("/update/:id", authAdmin, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const adminId = req.adminId
    try {
        const coursexist = await courseModel.findById(id);
        if (!coursexist) return res.status(404).json({ message: "course not found" })

        if (adminId == coursexist.creatorId.toString()) {
            await courseModel.findByIdAndUpdate(id, data);
            return res.status(200).json({ message: "Course has been updated successfully" })
        } else {
            return res.status(400).json({ message: "Only creator of this course can delete it" })
        }

    } catch (error) {
        res.status(400).json({ message: "something went srong" })
    }
})

module.exports = {
    courseRouter
}