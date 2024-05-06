require("dotenv").config()
const express = require("express")

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express()
const cors = require("cors")

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


const Authentication = require("./routers/authentication")
const accChecker = require("./routers/accountChecker")
const budgeting = require("./routers/budgeting")
const budgetFetcher = require("./routers/budgetFetcher")
const categories = require("./routers/categoriesFetcher")
const expenses = require("./routers/expenseFetcher")


app.use("/mb", Authentication, accChecker, budgeting, budgetFetcher, categories, expenses)

app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT)
})