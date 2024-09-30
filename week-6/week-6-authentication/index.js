const express = require("express");

const app = express();

app.use(express.json());

const users = [];

function genrateToken() {
    let token = '';
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)]
    }
    return token
}



app.post("/signup", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    users.push({
        userName: userName,
        password: password
    })
    console.log(users);

    res.status(200).json({ message: "user created" });
})

app.post("/signin", (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    let user = users.find(user => user.userName == userName && user.password == password);

    if (user) {
        const token = genrateToken();
        user.token = token;
        res.json({ token })
    } else {
        res.status(404).json({ message: "User not found" });
    }

    console.log(users);


})


app.get("/me", (req, res) => {
    const token = req.headers.token;
    const user = users.find(user => user.token == token);

    if (user) {
        res.json({ user })
    } else {
        res.json({ message: "USer not found" })
    }
})

app.listen(3000);