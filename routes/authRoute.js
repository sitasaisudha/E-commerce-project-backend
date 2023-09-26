const express = require("express");
const { login, register } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

module.exports = authRouter;