const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware.js");
const userController = require("../controllers/user.controller.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/verifytoken", auth, userController.verifyToken);
router.put("/update", auth, userController.update);

module.exports = router;
