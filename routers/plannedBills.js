const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const PlannedBills = require("../models/plannedBills");

// Create or update planned bill
router.post("/input/plannedBills", async (req, res) => {
    try {
        const { label, amount, date } = req.body;
        const utcDate = new Date(date).toISOString();
        const email = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRETKEY).email : null;

        let plannedBill = await PlannedBills.findOne({ where: { email, label } });
        if (!plannedBill) {
            plannedBill = await PlannedBills.create({ label, amount, date: utcDate, email, status: "active" });
        } else {
            await plannedBill.update({ label, amount, date: utcDate });
        }
        res.status(200).json({ message: "Planned bill added/updated successfully", plannedBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Get planned bills
router.get("/get/plannedBills", async (req, res) => {
    try {
        const email = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRETKEY).email : null;
        const plannedBills = await PlannedBills.findAll({
            where: { email },
            attributes: ["id", "label", "amount", "date", "status"]
        });
        res.json(plannedBills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Delete planned bill
router.delete("/delete/plannedBills/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRETKEY).email : null;
        await PlannedBills.destroy({ where: { id, email } });
        res.status(200).json({ message: "Planned bill deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Update planned bill
router.put("/update/plannedBills/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { label, amount, date } = req.body;
        const utcDate = new Date(date).toISOString();
        const email = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRETKEY).email : null;

        const updated = await PlannedBills.update(
            { label, amount, date: utcDate, status: "active" },
            { where: { id, email } }
        );

        if (updated[0] === 0) return res.status(404).json({ message: "Planned bill not found" });
        res.status(200).json({ message: "Planned bill updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Mark planned bill as paid
router.put("/pay/plannedBills/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRETKEY).email : null;
        const updated = await PlannedBills.update(
            { status: "paid" },
            { where: { id, email } }
        );

        if (updated[0] === 0) return res.status(404).json({ message: "Planned bill not found" });
        res.status(200).json({ message: "Planned bill marked as paid" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
