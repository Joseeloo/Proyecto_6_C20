const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const signToken = (user) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
    return jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ ok: false, message: "Faltan campos requeridos" });
        }
        if (password.length < 8) {
            return res.status(400).json({ ok: false, message: "La contraseña debe tener al menos 8 caracteres" });
        }
        const exists = await User.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.status(409).json({ ok: false, message: "El email ya está registrado" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed
        });
        const token = signToken(newUser);
        return res.status(201).json({
            ok: true,
            message: "Usuario registrado",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error en registro", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email y password son requeridos" });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
        }
        const token = signToken(user);
        return res.status(200).json({
            ok: true,
            message: "Login exitoso",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error en login", error: error.message });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        }
        return res.status(200).json({
            ok: true,
            message: "Token válido",
            user
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error verificando token", error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const update = {};
        if (name !== undefined) update.name = String(name).trim();
        if (email !== undefined) {
            const newEmail = String(email).toLowerCase().trim();
            const exists = await User.findOne({ email: newEmail, _id: { $ne: req.user.id } });
            if (exists) {
                return res.status(409).json({ ok: false, message: "Ese email ya está en uso" });
            }
            update.email = newEmail;
        }
        if (password !== undefined) {
            if (String(password).length < 8) {
                return res.status(400).json({ ok: false, message: "La contraseña debe tener al menos 8 caracteres" });
            }
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(String(password), salt);
        }
        const user = await User.findByIdAndUpdate(req.user.id, update, {
            new: true,
            runValidators: true
        }).select("-password");
        return res.status(200).json({
            ok: true,
            message: "Usuario actualizado",
            user
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error actualizando usuario", error: error.message });
    }
};
