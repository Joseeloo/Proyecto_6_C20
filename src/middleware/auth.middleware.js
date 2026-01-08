const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ ok: false, message: "Acceso no autorizado" });
    }
    const [type, token] = auth.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({ ok: false, message: "Formato de token inválido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        return next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "Token inválido o expirado"
        });
    }
};
