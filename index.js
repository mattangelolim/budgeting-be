require("dotenv").config()
const express = require("express")

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express()
const cors = require("cors")
const https = require("https");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs")

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");

const cred = {
  key,
  cert,
};

const httpsServer = https.createServer(cred, app);
// const file = fs.readFileSync('./AAD326B5F8D3D6B26DF4A5BE3F5FA60A.txt')


const Authentication = require("./routers/authentication")
const accChecker = require("./routers/accountChecker")
const budgeting = require("./routers/budgeting")
const budgetFetcher = require("./routers/budgetFetcher")
const categories = require("./routers/categoriesFetcher")
const expenses = require("./routers/expenseFetcher")

app.use("/mb", Authentication, accChecker, budgeting, budgetFetcher, categories, expenses)

// app.get('/.well-known/pki-validation/AAD326B5F8D3D6B26DF4A5BE3F5FA60A.txt', (req, res) => {
//   res.sendFile('/home/ubuntu/budgeting-be/AAD326B5F8D3D6B26DF4A5BE3F5FA60A.txt')
// })

app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT)
})

httpsServer.listen(process.env.HTTPSPORT, () => {
    console.log(`HTTPS server is running on ${process.env.HTTPSPORT}`);
  });