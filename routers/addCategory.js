const express = require("express");
const router = express.Router();
const categories = require("../models/categories");


// Route to add a new category
router.post("/addCategory", async (req, res) => {
    try {
        const { category } = req.body;

        // Validate required fields
        if (!category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create new category
        const newCategory = await categories.create({
            category_type: "Wants",
            categories: category,
            correctPercentage: 15
        });

        res.status(200).json({ message: "Category added successfully", data: newCategory });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
