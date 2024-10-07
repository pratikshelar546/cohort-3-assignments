require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { userRouter } = require("./routes/user.js");
const { adminRouter } = require('./routes/admin.js');
const { courseRouter } = require('./routes/course.js');
const { purchaseRouter } = require('./routes/purchase.js');

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/purchase", purchaseRouter);


app.listen(3000, () => console.log("server is running on 3000"))