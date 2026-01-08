const jwt = require("jsonwebtoken");
const { fail } = require("../utils/response.js");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return fail(res, { status: 401, message: "Acceso no autorizado" });
  }

  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return fail(res, { status: 401, message: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch {
    return fail(res, { status: 401, message: "Token inválido o expirado" });
  }
};

