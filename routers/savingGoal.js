const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SavingGoal = require("../models/savingGoal");

router.post("/input/savingGoal", async (req, res) => {
    try {
        const { description, amount } = req.body;
        const token = req.cookies.token;

        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        let savingGoal = await SavingGoal.findOne({ where: { email: email } });

        if (!savingGoal) {
            savingGoal = await SavingGoal.create({
                description,
                amount,
                email
            });
        } else {
            await SavingGoal.update(
                {
                    description,
                    amount
                },
                { where: { email: email } }
            );
        }

        res.status(200).json({ message: "Saving Goal added/updated successfully", savingGoal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/update/savingGoal", async (req, res) => {
    try {
        const { description, amount } = req.body;
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        await SavingGoal.update(
            {
                description: description,
                amount: amount
            },
            { where: { email: email } }
        );

        res.status(200).json({ message: "Saving Goals Saved successfully", savingGoal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/get/savingGoal", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const UserBudgetInfo = await SavingGoal.findOne({
            where: {
                email: email
            },
            attributes: ["description", "amount", "email"]
        })

        res.json(UserBudgetInfo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

router.delete("/delete/savingGoal/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await SavingGoal.destroy({ where: { id } });
        res.status(200).json({ message: "savingGoal deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;