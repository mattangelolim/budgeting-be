const express = require("express")
const router = express.Router()
const BudgetTF = require("../models/budgetTF")
const jwt = require('jsonwebtoken');

router.get("/checktf/user", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        console.log(token)

        const checkTfUser = await BudgetTF.findOne({
            where: {
                email: email
            },
            attributes: ["Timeframe"]
        })
        if (!checkTfUser) {
            return res.status(400).json({ isDone: false, message: "Please Input Budget Timeframe First" })
        } else {
            res.status(200).json({ isDone: true, Timeframe: checkTfUser.Timeframe });
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})


router.post("/select/timeframe", async (req, res) => {
    try {
        const token = req.cookies.token
        console.log(token)
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const { income, Timeframe } = req.body;

        const inputBudgetTF = await BudgetTF.create({
            email: email,
            income: income,
            Timeframe: Timeframe
        })

        res.json(inputBudgetTF)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router