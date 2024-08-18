const express = require("express");
const router = express.Router();
const Savings = require("../models/savings");

function getRandomizedTopFive(arr) {
    // Ensure the array has at least 5 elements
    if (arr.length <= 5) {
        return arr; // Return the array as is if it's 5 or fewer elements
    }

    // Shuffle the array
    const shuffledArray = arr.sort(() => Math.random() - 0.5);

    // Return only the top 5 elements from the shuffled array
    return shuffledArray.slice(0, 5);
}

router.post("/personal/tips", async (req, res) => {
    try {
        const { threshold } = req.body;

        let queryThreshold;
        
        if (threshold <= 30) {
            queryThreshold = 30;
        } else if (threshold > 30 && threshold < 70) {
            queryThreshold = 40;
        } else {
            queryThreshold = 70;
        }
        
        console.log("threshold", queryThreshold);

        // Fetch only the 'category' and 'description' fields
        const results = await Savings.findAll({
            where: { threshold: queryThreshold },
            attributes: ['category', 'description']
        });

        const randomizedResults = getRandomizedTopFive(results);

        res.status(200).json(randomizedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
