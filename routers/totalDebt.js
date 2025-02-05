const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const TotalDebt = require("../models/totalDebt");

router.post("/input/totalDebt", async (req, res) => {
    try {
        const { totalDebtAmount, paymentAmount } = req.body;
        const token = req.cookies.token;

        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        let totalDebt = await TotalDebt.findOne({ where: { email: email } });

        if (!totalDebt) {
            totalDebt = await TotalDebt.create({
                totalDebtAmount,
                paymentAmount,
                email
            });
        } else {
            await TotalDebt.update(
                {
                    totalDebtAmount,
                    paymentAmount
                },
                { where: { email: email } }
            );
        }

        res.status(200).json({ message: "Saving Goal added/updated successfully", totalDebt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/get/totalDebt", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const UserBudgetInfo = await TotalDebt.findOne({
            where: {
                email: email
            },
            attributes: ["totalDebtAmount", "paymentAmount", "email"]
        })

        res.json(UserBudgetInfo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;