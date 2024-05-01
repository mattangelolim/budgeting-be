const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];


    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }

    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            //   console.log(decoded)
            console.error("Invalid token:", decoded);
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;