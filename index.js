require("dotenv").config()
const express = require("express")
const admin = require("firebase-admin");

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
const PlannedBills = require("./models/plannedBills")

var serviceAccount = require("./budgeting-449f2-firebase-adminsdk-fbsvc-b3c681f4af.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (email, amount, date) => {
  try {
    const user = await User.findOne({ where: { email } });
    console.log(user)
    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for ${email}`);
      return;
    }

    const message = {
      to: user.fcmToken, // Use Expo Push Token
      sound: "alarm.wav",
      title: "Bill Reminder",
      body: `You have a planned bill of $${amount} due today.`,
      data: { amount, date }, // Additional data (optional)
      channelId: "default",
    };
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      console.log(`Notification sent to ${email}`);
    } catch (error) {
      console.log(`Error`, error);
    }
  } catch (err) {
    console.error("Error sending push notification:", err);
  }
};


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
const handleScanPlannedBills = async () => {
  try {
    const now = new Date();
    const nowFormatted = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

    const plannedBills = await PlannedBills.findAll();

    for (const bill of plannedBills) {
      const billDateFormatted = new Date(bill.date).toISOString().slice(0, 16); // Convert to same format

      if (billDateFormatted === nowFormatted) {
        await sendPushNotification(bill.email, bill.amount, bill.date);
      }
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
};


cron.schedule('* * * * *', async () => {
  // console.log('Running cron job...');
  await Promise.allSettled([handleUpdate(), handleScanPlannedBills()]);
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
const savings = require("./routers/personalSavings")
const deleteAcc = require("./routers/deleteAccount")
const currencyFetcher = require("./routers/currencyFetcher")
const savingGoal = require("./routers/savingGoal")
const totalDebt = require("./routers/totalDebt")
const plannedBills = require("./routers/plannedBills")

app.use("/mb", Authentication, accChecker, budgeting, budgetFetcher, categories, expenses, savings, deleteAcc, currencyFetcher, savingGoal, totalDebt, plannedBills)

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT)
})

httpsServer.listen(process.env.HTTPSPORT, () => {
  console.log(`HTTPS server is running on ${process.env.HTTPSPORT}`);
});