const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware.js");
const productController = require("../controllers/product.controller.js");

router.post("/create", auth, productController.create);
router.get("/readall", productController.readAll);
router.get("/readone/:id", productController.readOne);
router.put("/update/:id", auth, productController.update);
router.delete("/delete/:id", auth, productController.remove);

module.exports = router;
