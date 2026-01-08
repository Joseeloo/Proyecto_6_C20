const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ok, fail } = require("../utils/response.js");
const { isValidEmail } = require("../utils/validators.js");

const signToken = (user) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
    return jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return fail(res, { status: 400, message: "Faltan campos requeridos" });
    }
    if (!isValidEmail(email)) {
        return fail(res, { status: 400, message: "Email inválido" });
    }
    if (String(password).length < 8) {
        return fail(res, { status: 400, message: "La contraseña debe tener al menos 8 caracteres" });
    }
    const exists = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (exists) {
        return fail(res, { status: 409, message: "El email ya está registrado" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(String(password), salt);
    const newUser = await User.create({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: hashed
    });
    const token = signToken(newUser);
    return ok(res, {
        status: 201,
        message: "Usuario registrado",
        data: {
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        }
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return fail(res, { status: 400, message: "Email y password son requeridos" });
    }
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
        return fail(res, { status: 401, message: "Credenciales inválidas" });
    }
    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
        return fail(res, { status: 401, message: "Credenciales inválidas" });
    }
    const token = signToken(user);
    return ok(res, {
        message: "Login exitoso",
        data: {
            token,
            user: { id: user._id, name: user.name, email: user.email }
        }
    });
});

exports.verifyToken = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return fail(res, { status: 404, message: "Usuario no encontrado" });
    }
    return ok(res, { message: "Token válido", data: { user } });
});

exports.update = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (email !== undefined) {
        if (!isValidEmail(email)) {
            return fail(res, { status: 400, message: "Email inválido" });
        }
        const newEmail = String(email).trim().toLowerCase();
        const exists = await User.findOne({ email: newEmail, _id: { $ne: req.user.id } });
        if (exists) {
            return fail(res, { status: 409, message: "Ese email ya está en uso" });
        }
        update.email = newEmail;
    }
    if (password !== undefined) {
        if (String(password).length < 8) {
            return fail(res, { status: 400, message: "La contraseña debe tener al menos 8 caracteres" });
        }
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(String(password), salt);
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, {
        new: true,
        runValidators: true
    }).select("-password");
    return ok(res, { message: "Usuario actualizado", data: { user } });
});
