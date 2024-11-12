const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

router.get("/delete/acc", async (req, res) => {
    try {
        const token = req.cookies.token;

        // Verify the token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        // Find the user by email
        const user = await Users.findOne({
            where: { email: email }
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await Users.destroy({
            where: { email: email }
        });

        res.json({ message: "Successfully deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
