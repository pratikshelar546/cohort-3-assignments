const express = require("express");
const JWT_SECRET = "lifehack";
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const { default: mongoose } = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const { z } = require("zod");

mongoose.connect("mongodb+srv://pratik25:Q9aj4I9BQU6SOYmR@cluster0.mfw2o.mongodb.net/todoapp")

app.use(express.json());

const users = [];

// function genrateToken() {
//     let token = '';
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     for (let i = 0; i < 32; i++) {
//         token += options[Math.floor(Math.random() * options.length)]
//     }
//     return token
// }

const authenticationMiddleWare = (req, res, next) => {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (decodedToken.userId) {
        req.userId = decodedToken.userId;
        next();
    } else {
        res.json({ message: "user not found" })
    }
}


app.get("/", function (req, res) {
    res.sendFile("D:/task/Cohort-3/cohort-3-assignments/week-6/week-6-authentication/public/index.html")
})


app.post("/signup", async (req, res) => {
    const bodyFormt = z.object({
        email: z.string().min(5).max(30).email(),
        password: z.string().min(3).max(30),
        name: z.string()
    })

    const parseDataWithSuccess = bodyFormt.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Invalid format"
        })

    }

    const name = req.body.name;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 5);



    try {
        const userExist = await UserModel.findOne({
            email: email
        })
        if (userExist) return res.json({ message: "user already exist with this email" });


        await UserModel.create({
            email: email,
            name: name,
            password: password
        })

        res.status(200).json({ message: `user created: ${name}` });
    } catch (error) {
        res.status(400).json({ message: error });
    }



})

app.post("/signin", async (req, res) => {

    const bodyFormt = z.object({
        email: z.string().min(5).max(30).email(),
        password: z.string().min(3).max(30),

    })

    const parseDataWithSuccess = bodyFormt.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Invalid format"
        })
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "USer not found" });
        }

        const paswordMatch = await bcrypt.compare(password, user.password);

        if (user && paswordMatch) {
            const token = jwt.sign({
                userId: user._id.toString()
            }, JWT_SECRET)
            console.log(token, "token");

            res.json({ token })
        } else {
            res.status(404).json({ message: "Inavlid credentials" });
        }

    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
})


app.get("/me", authenticationMiddleWare, async (req, res) => {
    const user = await UserModel.findById(req.userId);


    if (user) {
        res.json({ user })
    } else {
        res.json({ message: " user not found 2s" })
    }
})


app.post("/addtodo", authenticationMiddleWare, async (req, res) => {

    const bodyFormat = z.object({
        title: z.string().min(3).max(100),
        done: z.boolean(),
        deadLine: z.string(),

    })
    const userId = req.userId;

    const bodySafeParse = bodyFormat.safeParse(req.body);
    if (!bodySafeParse) {
        return res.json({ message: "Inavlid format of data" });
    }

    const { title, done, deadLine } = req.body

    try {
        const existuser = await UserModel.findById(userId);
        if (!existuser) {
            return res.status(404).json({ message: "user not found" });
        }

        const todo = await TodoModel.create({
            title: title,
            userId: userId,
            done: done,
            deadLine: deadLine
        })
        res.status(202).json({ message: "todo added", todo })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

app.get("/todos", authenticationMiddleWare, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    }).populate('userId').exec();

    res.json({
        todos
    })
});

app.put("/updateTodo/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await TodoModel.findById(id);
        if (!todo) return res.json({ message: "todo not found" })
        await TodoModel.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "Todo updated" })

    } catch (error) {
        res.status(404).json({ error })
    }
})



app.listen(3000);