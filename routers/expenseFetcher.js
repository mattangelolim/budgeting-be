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
            const { date, thisPercentage, allocated_amount, category } = expense;

            if (!summary[date]) {
                summary[date] = {
                    totalIncome: 0,
                    totalExpenses: 0,
                    savings: 0,
                    maxPercentageExpense: {
                        category: "",
                        percentage: 0,
                        amount: 0
                    }
                };
            }

            summary[date].totalIncome += allocated_amount;
            if (category !== "Savings") {
                summary[date].totalExpenses += allocated_amount;
            }
            if (thisPercentage > summary[date].maxPercentageExpense.percentage && category !== "Savings") {
                summary[date].maxPercentageExpense = {
                    category,
                    percentage: thisPercentage,
                    amount: allocated_amount
                };
            }
        });
        Object.keys(summary).forEach(date => {
            summary[date].savings = summary[date].totalIncome - summary[date].totalExpenses;
        });
        console.log(summary);
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
        const timeSeriesData = formattedExpenses.map(({ totalAmount }) => totalAmount);
        console.log(timeSeriesData)

        const arimaConfig = {
            p: 2, // AR order
            d: 1, // I order
            q: 1, // MA order
            verbose: false
        };

        const arimaModel = new ARIMA(arimaConfig);
        arimaModel.train(timeSeriesData);


        const firstPredictedValue = Math.round(arimaModel.predict(1)[0]);

        // Add the first predicted value to the time series data
        const updatedTimeSeriesData = [...timeSeriesData, firstPredictedValue];

        // Retrain ARIMA model with the updated data
        arimaModel.train(updatedTimeSeriesData);

        // Predict the next value (second predicted value)
        const secondPredictedValue = Math.round(arimaModel.predict(1)[0]);

        const nextTwoDaysForecast = [
            {
                date: 'Predicted Day 1',
                totalAmount: firstPredictedValue,
                totalPercentage: Math.round(firstPredictedValue * 0.1)
            },
            {
                date: 'Predicted Day 2',
                totalAmount: secondPredictedValue,
                totalPercentage: Math.round(secondPredictedValue * 0.2)
            }
        ];

        // Combine the actual data and forecasted data
        const combinedData = [...formattedExpenses, ...nextTwoDaysForecast];

        res.json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router