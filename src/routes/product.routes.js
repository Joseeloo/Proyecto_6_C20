const express = require("express");
const router = express.Router();

router.post("/create", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "create product endpoint (coming soon)",
    body: req.body
  });
});

router.get("/readall", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)"
  });
});

router.get("/readone/:id", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)",
    id: req.params.id
  });
});

router.put("/update/:id", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)",
    id: req.params.id,
    body: req.body
  });
});

router.delete("/delete/:id", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "Endpoint (proximamente)",
    id: req.params.id
  });
});

module.exports = router;
