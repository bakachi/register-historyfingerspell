// routes.js

const express = require("express");
const { register, loginGoogle, loginEmail } = require("./handler.js");

const router = express.Router();

router.post("/register", register);
router.post("/login/google", loginGoogle);
router.post("/login/email", loginEmail);

module.exports = router;
