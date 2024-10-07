const { Router } = require("express");
const { auth } = require("../middleware/userMiddleware");
const { courseModel, purchaseModel, userModel } = require("../database/db");

const purchaseRouter = Router();


purchaseRouter.post("/:id", auth, async (req, res) => {
    const userId = req.userId;
    const { id } = req.params
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not exist" });

        const coursexist = await courseModel.findById(id);
        if (!coursexist) return res.status(404).json({ message: "Course dose not exist" });

        let purchase = await purchaseModel.findOne({ userId: userId });

        if (!purchase) {
            purchase = new purchaseModel({
                userId, courses: [{ courseId: id }]
            })

        } else {
            const buyCourse = purchase?.courses?.find(c => c.courseId.toString() == id)
            if (buyCourse) {
                return res.status(400).json({ message: "Course Already purchased" });
            } else {
                purchase?.courses?.push({ courseId: id });
            }
        }

        await purchase?.save();

        return res.status(202).json({ message: "Course successfully purchased", course: coursexist })
    } catch (error) {
        res.status(400).json({ message: "something went srong" })

    }
})

purchaseRouter.get("/", auth, async (req, res) => {
    const userId = req.userId;

    try {
        const purchases = await purchaseModel.findOne({ userId: userId });
        if (!purchases) return res.status(404).json({ message: "You dont have any purchase" })
        return res.status(200).json({ purchases })
    } catch (error) {
        res.status(400).json({ message: "something went srong" })

    }
})


purchaseRouter.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        let purchase = await purchaseModel.findOne({ userId: userId });
        if (!purchase) return res.status(400).json({ message: "You haven't purchased any course" });

        const courseExist = purchase.courses.find(c => c._id.toString() === id)

        if (!courseExist) return res.status(404).json({ message: "Course not found" })
        purchase.courses = purchase.courses.filter(c => c._id.toString() !== id);

        if (purchase.courses.length === 0) {
            console.log("deleted");
            await purchase.deleteOne();
            return res.status(200).json({ message: "Course has been deleted" })

        }
        await purchase.save();

        return res.status(200).json({ message: "Course has been deleted", purchase })
    } catch (error) {
        console.log(error);

        res.status(400).json({ message: "something went srong" })
    }
})

module.exports = {
    purchaseRouter
}