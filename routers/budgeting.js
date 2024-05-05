const express = require("express")
const router = express.Router()
const Expenses = require("../models/expenses")
const Category = require("../models/categories")
const jwt = require('jsonwebtoken');
const BudgetTF = require("../models/budgetTF");

router.post("/insert/expenses", async (req, res) => {
    try {
        const token = req.cookies.token;
        const date = req.query.date;
        const { budgetCategories } = req.body;

        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const checkUserIncome = await BudgetTF.findOne({
            where: {
                email: email
            },
            attributes: ["income", "total_savings", "overall_expense"]
        })

        if (!Array.isArray(budgetCategories)) {
            return res.status(400).json({ message: "Budget categories must be an array of objects." });
        }
        const userIncome = checkUserIncome.income;
        const totalSavings = checkUserIncome.total_savings;
        const overallExpenses = checkUserIncome.overall_expense;

        const totalPercentage = budgetCategories.reduce((total, category) => total + category.percentage, 0);
        const remainingPercentage = 100 - totalPercentage;

        if (totalPercentage > 100) {
            return res.status(400).json({ message: "Total percentage exceeds 100%." });
        }

        if (budgetCategories.length < 4) {
            return res.status(400).json({ message: "At least 4 budget categories are required." });
        }

        // Automatically add a Savings category if there is remaining percentage
        if (remainingPercentage > 0) {
            budgetCategories.push({ category: "Savings", percentage: remainingPercentage });
        }

        // Calculate allocated amounts for each budget category
        let totalAllocatedAmountForSavings = 0;
        let totalAllocatedAmountForExpenses = 0;

        // Insert budget categories into the table
        for (const categoryData of budgetCategories) {
            const category = await Category.findOne({ where: { categories: categoryData.category } });
            if (!category) {
                console.error(`Category "${categoryData.category}" not found in the categories table.`);
                continue;
            }

            const allocatedAmount = (categoryData.percentage / 100) * userIncome;

            if (categoryData.category === "Savings") {
                totalAllocatedAmountForSavings += allocatedAmount;
            } else {
                totalAllocatedAmountForExpenses += allocatedAmount;
            }


            await Expenses.create({
                email,
                date,
                category_type: category.category_type,
                category: categoryData.category,
                thisPercentage: categoryData.percentage,
                allocated_amount: allocatedAmount
            });
        }
        const updatedTotalSavings = totalSavings + totalAllocatedAmountForSavings;
        const updatedOverallExpenses = overallExpenses + totalAllocatedAmountForExpenses;
        await BudgetTF.update({
            total_savings: updatedTotalSavings,
            overall_expense: updatedOverallExpenses,
            income: 0
        }, {
            where: {
                email: email
            }
        });

        res.status(200).json({ message: "Budget categories inserted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router