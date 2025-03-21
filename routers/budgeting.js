const express = require("express")
const router = express.Router()
const Expenses = require("../models/expenses")
const Category = require("../models/categories")
const jwt = require('jsonwebtoken');
const BudgetTF = require("../models/budgetTF")
const User = require("../models/user")

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
            attributes: ["TF_id", "income", "total_savings", "overall_expense"]
        })

        if (!Array.isArray(budgetCategories)) {
            return res.status(400).json({ message: "Budget categories must be an array of objects." });
        }

        const totalSavings = checkUserIncome.total_savings;
        const overallExpenses = checkUserIncome.overall_expense;
        const TF_id = checkUserIncome.TF_id;

        const totalAmount = budgetCategories.reduce((total, category) => total + category.percentage, 0);
        // Extract savings and total expenses
        const { savings, totalExpenses } = budgetCategories.reduce(
            (acc, category) => ({
                savings: acc.savings + (category.category.toLowerCase() === "savings" ? category.percentage : 0),
                totalExpenses: acc.totalExpenses + (category.category.toLowerCase() !== "savings" ? category.percentage : 0),
            }),
            { savings: 0, totalExpenses: 0 }
        );

        if (budgetCategories.length < 4) {
            return res.status(400).json({ message: "At least 4 budget categories are required." });
        }

        // Insert budget categories into the table
        for (const categoryData of budgetCategories) {
            const category = await Category.findOne({ where: { categories: categoryData.category } });
            if (!category) {
                console.error(`Category "${categoryData.category}" not found in the categories table.`);
                continue;
            }

            const percentage = (categoryData.percentage / totalAmount) * 100;        

            await Expenses.create({
                email,
                TF_id,
                date,
                category_type: category.category_type,
                category: categoryData.category,
                thisPercentage: percentage,
                allocated_amount: categoryData.percentage
            });
        }
        const updatedTotalSavings = totalSavings + savings;
        const updatedOverallExpenses = overallExpenses + totalExpenses;
        await BudgetTF.update({
            total_savings: updatedTotalSavings,
            overall_expense: updatedOverallExpenses,
        }, {
            where: {
                email: email
            }
        });
        await User.update({
            isDone: "1"
        }, {
            where: {
                email: email
            }
        })

        res.status(200).json({ message: "Budget categories inserted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/insert/one/expense", async (req, res) => {
    try {
        const token = req.cookies.token;
        const date = req.query.date;
        const { category, percent } = req.body;

        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        // Fetch user's budget information
        const userBudget = await BudgetTF.findOne({
            where: {
                email: email
            },
            attributes: ["TF_id", "income", "total_savings", "overall_expense"]
        });

        // Fetch savings for the given date
        const savingsForDate = await Expenses.findOne({
            where: {
                email: email,
                date: date
            },
            attributes: ["thisPercentage", "allocated_amount"]
        });

        if (!userBudget || !savingsForDate) {
            return res.status(404).json({ message: "User or savings information not found." });
        }

        // Calculate the capital amount of income
        const capitalIncome = (savingsForDate.allocated_amount * 100) / savingsForDate.thisPercentage;

        console.log(capitalIncome)

        // Calculate the allocated amount for the new category
        const allocatedAmountForCategory = (percent * capitalIncome) / 100;

        console.log(allocatedAmountForCategory)

        // Now you can proceed with inserting the new expense with the calculated allocated amount

        // Example of inserting the new expense
        // const newExpense = await Expenses.create({
        //     email: email,
        //     date: date,
        //     category: category,
        //     allocated_amount: allocatedAmountForCategory
        // });

        res.status(200).json({ allocatedAmountForCategory });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})


router.post("/input/income", async (req, res) => {
    try {
        const { income } = req.body;
        const token = req.cookies.token;

        // Verify token and get email
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        let budget = await BudgetTF.findOne({ where: { email: email } });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // Parse the income value to float
        const parsedIncome = parseFloat(income);

        // Increment the income value and save the updated budget
        budget.income += parsedIncome;
        await budget.save();

        res.status(200).json({ message: "Income added to budget successfully", updatedBudget: budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/change/timeframe", async (req, res) => {
    try {
        const { timeframe } = req.body;
        const token = req.cookies.token;

        // Verify token and get email
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        const TF_id = generateRandomString(8);

        const updatedBudget = await BudgetTF.update(
            { Timeframe: timeframe, TF_id: TF_id },
            { where: { email: email } }
        );

        if (updatedBudget[0] === 0) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Timeframe updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router