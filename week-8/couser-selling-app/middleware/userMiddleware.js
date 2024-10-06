const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
    
function auth(req, res, next) {
    const token = req.headers.token;
    const verifyToken = jwt.verify(token, JWT_SECRET)
    if (verifyToken.userId) {
        req.userId = verifyToken.userId;
        next();
    } else {
        res.json({ message: "USer not found" })
    }
}
module.exports = {
    auth
}