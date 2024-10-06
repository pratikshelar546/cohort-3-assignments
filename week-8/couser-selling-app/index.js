require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { userRouter } = require("./routes/user.js");
const { adminRouter } = require('./routes/admin.js');
const app = express();
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter)
app.listen(3000, () => console.log("server is running on 3000"))