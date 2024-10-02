const express = require("express");
const JWT_SECRET = "lifehack";
const jwt = require("jsonwebtoken");
const app = express();

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

    if (decodedToken.userName) {
        req.userName = decodedToken.userName;
        next();
    } else {
        res.json({ message: "user not found" })
    }
}


app.get("/", function (req, res) {
    res.sendFile("D:/task/Cohort-3/cohort-3-assignments/week-6/week-6-authentication/public/index.html")
})
app.post("/signup", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    users.push({
        userName: userName,
        password: password
    })


    res.status(200).json({ message: "user created" });
})

app.post("/signin", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    let user = users.find(user => user.userName == userName && user.password == password);

    if (user) {
        // const token = genrateToken();
        const token = jwt.sign({
            userName: userName
        }, JWT_SECRET)

        res.json({ token })
    } else {
        res.status(404).json({ message: "User not found" });
    }



})


app.get("/me", authenticationMiddleWare, (req, res) => {
    const user = users.find(user => user.userName == req.userName);

    if (user) {
        res.json({ user })
    } else {
        res.json({ message: " user not found 2s" })
    }
})

app.listen(3000);