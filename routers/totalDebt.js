const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const TotalDebt = require("../models/totalDebt");

router.post("/input/totalDebt", async (req, res) => {
    try {
        const { label, totalDebtAmount, paymentAmount } = req.body;
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        const email = decodedToken.email;

        const totalDebt = await TotalDebt.create({
            label,
            totalDebtAmount,
            paymentAmount,
            email,
            status: "active"
        });

        res.status(200).json({ message: "Debt added successfully", totalDebt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/get/totalDebt", async (req, res) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        const email = decodedToken.email;

        const debts = await TotalDebt.findAll({
            where: { email },
            attributes: ["id", "label", "totalDebtAmount", "paymentAmount", "status"]
        });

        res.json(debts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/totalDebt/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await TotalDebt.destroy({ where: { id } });
        res.status(200).json({ message: "Debt deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/pay/totalDebt/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await TotalDebt.update({ status: "paid" }, { where: { id } });
        res.status(200).json({ message: "Debt marked as paid" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/update/totalDebt/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { label, totalDebtAmount, paymentAmount } = req.body;

        await TotalDebt.update(
            { label, totalDebtAmount, paymentAmount, status: "active" },
            { where: { id } }
        );

        res.status(200).json({ message: "Debt updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;