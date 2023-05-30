const express = require("express")
// const { register, login, logout } = require("../controllers/auth.controller")

const authController = require("../controllers/auth.controller")

const router = express.Router()

router.get("/signup", authController.register)
router.get("/login", authController.login)
router.get("/logout", authController.logout)

// router.route("/register").post(register)

// router.route("/login").post(login)

// router.route("/logout").get(logout)

module.exports = router
