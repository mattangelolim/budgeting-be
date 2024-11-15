const express = require("express");
const router = express.Router();
const exchangeRate = require("../models/exchangeRate");
const fetch = require("node-fetch");
const countries = require("../middlewares/countries");

router.get("/currencyFetcher", async (req, res) => {
    try {
        const latestRate = await exchangeRate.findOne({
            order: [["fetchDate", "DESC"]],
        });

        const currentTime = new Date();
        const oneDayAgo = new Date(currentTime.getTime() - 60 * 1000);

        if (!latestRate || new Date(latestRate.fetchDate) < oneDayAgo) {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API}/latest/USD`);
            const data = await response.json();

            // Check if data and conversion_rates are defined
            if (!data || !data.conversion_rates) {
                throw new Error("Invalid data received from exchange rate API");
            }

            const rateData = data.conversion_rates;

            const formattedRates = Object.entries(rateData ?? {}).map(([currency, rate]) => {
                const country = countries[currency] || { name: currency, isoCode: "N/A" };
                return {
                    Country: country.name,
                    ISOCode: country.code || "N/A",
                    Currency: currency,
                    Rate: rate ?? 0,
                };
            });

            await exchangeRate.create({
                rateData: formattedRates,
                fetchDate: currentTime,
            });

            console.log(formattedRates);
            return res.json(formattedRates);
        }

        console.log(latestRate.rateData);
        res.json(latestRate.rateData ?? []);
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
        res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
});

module.exports = router;
