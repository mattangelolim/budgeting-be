const express = require("express");
const router = express.Router();
const Savings = require("../models/savings");

function randomizeFive(arr) {
    // Step 1: Select 5 unique random indices
    const indices = [];
    while (indices.length < 5) {
        const randIndex = Math.floor(Math.random() * arr.length);
        if (!indices.includes(randIndex)) {
            indices.push(randIndex);
        }
    }

    // Step 2: Extract the elements at those indices
    const elementsToShuffle = indices.map(index => arr[index]);

    // Step 3: Shuffle the selected elements
    for (let i = elementsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elementsToShuffle[i], elementsToShuffle[j]] = [elementsToShuffle[j], elementsToShuffle[i]];
    }

    // Step 4: Place the shuffled elements back into their original positions
    indices.forEach((index, i) => {
        arr[index] = elementsToShuffle[i];
    });

    return arr;
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

        const randomizedResults = randomizeFive(results);

        res.status(200).json(randomizedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
