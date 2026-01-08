require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db.js");

const userRoutes = require("./src/routes/user.routes.js");
const productRoutes = require("./src/routes/product.routes.js");

const notFound = require("./src/middleware/notFound.js");
const errorHandler = require("./src/middleware/errorHandler.js");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  return res.status(200).json({ ok: true, message: "API OK" });
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
