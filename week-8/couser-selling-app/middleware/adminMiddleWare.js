const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

function authAdmin(req, res, next) {
    try {
        const token = req.headers.token;

        const verifyToken = jwt.verify(token, JWT_SECRET);

        if (verifyToken.adminId) {
            req.adminId = verifyToken.adminId
            next();
        } else {
            res.status(404).json({ message: "Access denied" })
        }



    } catch (error) {
        res.status(400).json({ message: "Somthing went wrong" })
    }
}

module.exports = {
    authAdmin
}