require("dotenv").config()
const express = require("express")

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express()
const cors = require("cors")
const https = require("https");
const cron = require("node-cron")

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs")

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");

const BudgetTF = require("./models/budgetTF")
const User = require("./models/user")

const handleUpdate = async () => {
  try {
    const data = await BudgetTF.findAll();
    for (const row of data) {
      if (row.Timeframe.toLowerCase() === 'daily') {
        const usersToUpdate = await User.findAll({ where: { email: row.email } });
        for (const user of usersToUpdate) {
          await user.update({ isDone: '0' });
        }
      }
    }
    console.log('Updated users successfully.');
  } catch (err) {
    console.error('Error handling update:', err);
    throw err;
  }
};

cron.schedule('* * * * *', async () => {
  console.log('Running cron job...');
  await handleUpdate();
});

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


app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT)
})

httpsServer.listen(process.env.HTTPSPORT, () => {
  console.log(`HTTPS server is running on ${process.env.HTTPSPORT}`);
});