const express = require("express");
const router = express.Router();

const {registerUser,signinuser, verifyuser} = require ("../controller/authcontroller")
const {verifytoken} = require("../middleware/verifytoken")


router.post("/register", registerUser);
router.post("/login", signinuser);
router.post("/getuser",verifytoken,verifyuser)

module.exports = router;
