require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db.js");

const userRoutes = require("./src/routes/user.routes.js");
const productRoutes = require("./src/routes/product.routes.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ ok: true, message: "API OK" });
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.use((req, res) => {
  return res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
