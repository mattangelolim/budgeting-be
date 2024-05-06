const express = require("express")
const router = express.Router()
const Budget = require("../models/budgetTF");
const jwt = require('jsonwebtoken');

router.get("/user/budget", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const UserBudgetInfo = await Budget.findOne({
            where: {
                email: email
            },
            attributes: ["overall_expense", "total_savings", "Timeframe", "TF_id"]
        })

        res.json(UserBudgetInfo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router