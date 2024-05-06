const express = require("express")
const router = express.Router()
const Expenses = require("../models/expenses")
const Budget = require("../models/budgetTF")
const jwt = require('jsonwebtoken');

router.get("/user/expenses", async (req, res) => {
    try {
        const token = req.cookies.token
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const CheckUserTFId = await Budget.findOne({
            where: {
                email: email
            },
            attributes: ["TF_id"]
        })
        const expenses = await Expenses.findAll({
            where: {
                email: email,
                TF_id: CheckUserTFId.TF_id
            },
            attributes: ["category_type", "category", "thisPercentage", "allocated_amount", "date"]
        })

        const organizedExpenses = {};
        expenses.forEach(expense => {
            const { date } = expense;
            if (!organizedExpenses[date]) {
                organizedExpenses[date] = [];
            }
            organizedExpenses[date].push(expense);
        });

        // Convert the object to array of arrays
        const result = Object.values(organizedExpenses);

        res.json(result);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
})

router.get("/user/expenses-summary", async (req, res) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const CheckUserTFId = await Budget.findOne({
            where: {
                email: email
            },
            attributes: ["TF_id"]
        });

        const expenses = await Expenses.findAll({
            where: {
                email: email,
                TF_id: CheckUserTFId.TF_id
            },
            attributes: ["category_type", "category", "thisPercentage", "allocated_amount", "date"]
        });

        const summary = {};

        expenses.forEach(expense => {
            const { date, thisPercentage, allocated_amount } = expense;
            if (!summary[date]) {
                summary[date] = {
                    totalIncome: 0,
                    savings: 0,
                    maxPercentageExpense: {
                        category: "",
                        percentage: 0,
                        amount: 0
                    }
                };
            }

            summary[date].totalIncome += allocated_amount;
            summary[date].savings += 100 - thisPercentage; 
            if (thisPercentage > summary[date].maxPercentageExpense.percentage && expense.category !== "Savings") {
                summary[date].maxPercentageExpense.category = expense.category;
                summary[date].maxPercentageExpense.percentage = thisPercentage;
                summary[date].maxPercentageExpense.amount = allocated_amount;
            }
        });

        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router