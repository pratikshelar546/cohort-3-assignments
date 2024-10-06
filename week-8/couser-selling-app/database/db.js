const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URL)
const userSchema = new Schema({
    email: {
        type: String,
        uniqure: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
userSchema.methods.genrateJwtToken = function () {
    return jwt.sign({ userId: this._id.toString() }, jwt_secret)
}
const adminSchema = new Schema({
    email: {
        type: String,
        uniqure: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})
adminSchema.methods.genrateJwtToken = function () {
    return jwt.sign({ adminId: this._id.toString() }, jwt_secret)
}
const couserSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "admin"
    }
})
const purchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "course"
    }
})
const userModel = mongoose.model("user", userSchema)
const adminModel = mongoose.model("admin", adminSchema)
const courseModel = mongoose.model("course", couserSchema)
const purchaseModel = mongoose.model("puchases", purchaseSchema)
module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}