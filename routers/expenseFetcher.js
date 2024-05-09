const express = require("express")
const router = express.Router()
const Expenses = require("../models/expenses")
const Budget = require("../models/budgetTF")
const jwt = require('jsonwebtoken');
const Categories = require("../models/categories")
const { Op } = require("sequelize")
const ARIMA = require('arima');

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

router.get("/analysis/data", async (req, res) => {
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

        const analyzeExpense = await Expenses.findAll({
            where: {
                email: email,
                TF_id: CheckUserTFId.TF_id
            },
            attributes: ["category_type", "category", "thisPercentage", "allocated_amount", "date"]
        });

        // Fetch correct percentages from the categories table
        const categories = await Categories.findAll({
            attributes: ["categories", "correctPercentage"]
        });

        // Construct a map of correct percentages by category
        const correctPercentagesMap = new Map();
        categories.forEach(category => {
            correctPercentagesMap.set(category.categories, category.correctPercentage);
        });

        const incorrectExpenses = analyzeExpense.filter(expense => {
            if (expense.category === "Savings") return false;
            const correctPercentage = correctPercentagesMap.get(expense.category);
            return correctPercentage !== undefined && expense.thisPercentage > correctPercentage;
            expense.recommendedPercentage = correctPercentage;
        });

        res.json(incorrectExpenses);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/moving/average", async (req, res) => {
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
                TF_id: CheckUserTFId.TF_id,
                category: {
                    [Op.ne]: "Savings" // Exclude Savings category
                }
            },
            attributes: ["category", "thisPercentage", "allocated_amount", "date"]
        });

        // Group expenses by date
        const expensesByDate = expenses.reduce((acc, expense) => {
            if (!acc[expense.date]) {
                acc[expense.date] = {
                    totalAmount: 0,
                    totalPercentage: 0
                };
            }
            acc[expense.date].totalAmount += expense.allocated_amount;
            acc[expense.date].totalPercentage += expense.thisPercentage;
            return acc;
        }, {});

        // Convert grouped expenses into array format
        const formattedExpenses = Object.entries(expensesByDate).map(([date, { totalAmount, totalPercentage }]) => ({
            date,
            totalAmount,
            totalPercentage
        }));

        // Calculate moving average
        const windowSize = 3; // Define your window size here
        const movingAverage = formattedExpenses.map((expense, index, array) => {
            const startIndex = Math.max(0, index - windowSize + 1);
            const endIndex = index + 1;
            const window = array.slice(startIndex, endIndex);
            const averageTotalAmount = window.reduce((sum, item) => sum + item.totalAmount, 0) / window.length;
            const averageTotalPercentage = window.reduce((sum, item) => sum + item.totalPercentage, 0) / window.length;
            return {
                date: expense.date,
                movingAverageTotalAmount: averageTotalAmount,
                movingAverageTotalPercentage: averageTotalPercentage
            };
        });

        // Retrieve the last item from the movingAverage array
        const latestMovingAverage = movingAverage[movingAverage.length - 1];

        const threshold = 75;
        let interpretation = "Message";
        if (latestMovingAverage && latestMovingAverage.movingAverageTotalPercentage > threshold) {
            interpretation = "The expenses exceeded to the recommended threshold";
        } else {
            interpretation = "The current average of expenses are good"
        }

        // Format the response
        const response = {
            Interpretation: interpretation,
            data: movingAverage
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/arima/expenses", async (req, res) => {
    try {
        const { type } = req.query;

        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, `${process.env.SECRETKEY}`);
        const email = decodedToken.email;

        const CheckUserTFId = await Budget.findOne({
            where: {
                email: email
            },
            attributes: ["TF_id"]
        });

        let expenses;
        if (type && type !== "Savings") {
            expenses = await Expenses.findAll({
                where: {
                    email: email,
                    TF_id: CheckUserTFId.TF_id,
                    category: {
                        [Op.ne]: "Savings" // Exclude Savings category
                    }
                },
                attributes: ["category", "thisPercentage", "allocated_amount", "date"]
            });
        } else {
            expenses = await Expenses.findAll({
                where: {
                    email: email,
                    TF_id: CheckUserTFId.TF_id,
                    category: "Savings"
                },
                attributes: ["category", "thisPercentage", "allocated_amount", "date"]
            });
        }

        // Group expenses by date
        const expensesByDate = expenses.reduce((acc, expense) => {
            if (!acc[expense.date]) {
                acc[expense.date] = {
                    totalAmount: 0,
                    totalPercentage: 0
                };
            }
            acc[expense.date].totalAmount += expense.allocated_amount;
            acc[expense.date].totalPercentage += expense.thisPercentage;
            return acc;
        }, {});

        // Convert grouped expenses into array format
        const formattedExpenses = Object.entries(expensesByDate).map(([date, { totalAmount, totalPercentage }]) => ({
            date,
            totalAmount,
            totalPercentage
        }));

        // Prepare time series data
        const timeSeriesData = formattedExpenses.map(({ totalAmount, totalPercentage }) => [totalAmount, totalPercentage]);

        // Specify p, d, and q values for ARIMA model
        const p_value = 2;
        const d_value = 1;
        const q_value = 2;

        // Train ARIMA model
        const arimaModel = new ARIMA({ p: p_value, d: d_value, q: q_value, verbose: false }); // Initialize ARIMA model with specified p, d, and q values
        arimaModel.train(timeSeriesData); // Train ARIMA model

        // Predict the next 2 days' values
        const forecast = arimaModel.predict(2); // Predict next 2 time steps

        // Create objects for the forecasted days
        const nextTwoDaysForecast = forecast.map(([totalAmount, totalPercentage], index) => {
            let adjustedTotalPercentage = Math.round(totalPercentage);
    adjustedTotalPercentage = Math.max(20, Math.min(adjustedTotalPercentage, 100)); // Ensure it's between 20 and 100
    return {
        date: `Predicted Day ${index + 1}`,
        totalAmount: Math.round(totalAmount),
        totalPercentage: adjustedTotalPercentage
    };
        });

        // Combine the actual data and forecasted data
        const combinedData = [...formattedExpenses, ...nextTwoDaysForecast];

        res.json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router