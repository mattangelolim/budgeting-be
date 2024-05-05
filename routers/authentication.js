const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../models/user")

router.post("/signin/user", async (req, res) => {
    try {
        const { email, password } = req.body

        const ifUserExist = await Users.findOne({
            where: {
                email: email
            }
        })
        if (!ifUserExist) {
            return res.status(204).json({ message: "user not found" })
        }

        const ifPasswordMatch = await bcrypt.compare(password, ifUserExist.password)

        if (!ifPasswordMatch) {
            return res.status(204).json({ message: "wrong password" })
        }

        const token = jwt.sign({ userId: ifUserExist.id, mobile: ifUserExist.mobile, email: ifUserExist.email, username: ifUserExist.username }, process.env.SECRETKEY, {
            expiresIn: "8h",
        });

        res.cookie('token', token, { maxAge: 900000, httpOnly: true });

        res.status(200).json({ token });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/signup/user", async (req, res) => {
    try {
        const { mobile, email, username, password } = req.body

        const findIfExisting = await Users.findOne({
            where: {
                mobile: mobile,
                email: email
            }
        })

        if (findIfExisting) {
            return res.status(409).json({ message: "Existing User" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = await Users.create({
            mobile,
            email,
            username,
            password: hashedPassword
        })

        res.status(201).json({ message: "User created successfully" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

// router.get("/check/user", async (req,res ) =>{
//     try {

//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ message: error.message })
//     }
// })

router.post("/logout/user", async (req, res) => {
    try {
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });

        res.status(200).json({ message: "Logout Success" });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router