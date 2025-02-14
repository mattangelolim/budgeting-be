const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const PlannedBills = require("../models/plannedBills");

router.post("/input/plannedBills", async (req, res) => {
    try {
        const { amount, date } = req.body;
        const token = req.cookies.token;
        const utcDate = new Date(date).toISOString();

        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        let plannedBills = await PlannedBills.findOne({ where: { email: email } });

        if (!plannedBills) {
            plannedBills = await PlannedBills.create({
                amount,
                date: utcDate,
                email
            });
        } else {
            await PlannedBills.update(
                {
                    amount,
                    date: utcDate
                },
                { where: { email: email } }
            );
        }

        res.status(200).json({ message: "Saving Goal added/updated successfully", plannedBills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/get/plannedBills", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const UserBudgetInfo = await PlannedBills.findOne({
            where: {
                email: email
            },
            attributes: ["amount", "date", "email"]
        })

        res.json(UserBudgetInfo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;