const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "register endpoint (coming soon)",
    body: req.body
  });
});

router.post("/login", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)",
    body: req.body
  });
});

router.get("/verifytoken", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)"
  });
});

router.put("/update", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)",
    body: req.body
  });
});

module.exports = router;
