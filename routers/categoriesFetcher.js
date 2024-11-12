const express = require("express")
const router = express.Router()
const Categories = require("../models/categories")

router.get("/categories", async (req, res) => {
    try {
        const FetchCategories = await Categories.findAll({
            attributes: ["id", "category_type", "categories", "correctPercentage"]
        })

        res.json(FetchCategories)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
})

module.exports = router