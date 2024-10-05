const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;




const User = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String
})

const Todo = new Schema({
    title: String,
    done: Boolean,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    deadLine: String
},
    { timestamps: true }
)


const UserModel = mongoose.model("user", User)
const TodoModel = mongoose.model("todo", Todo)

module.exports = {
    UserModel, TodoModel
}
