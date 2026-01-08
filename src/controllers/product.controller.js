const Product = require("../models/Product.js");

exports.create = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ ok: false, message: "name y price son requeridos" });
        }
        const newProduct = await Product.create({
            user: req.user.id,
            name: String(name).trim(),
            description: description ? String(description).trim() : "",
            price: Number(price)
        });
        return res.status(201).json({
            ok: true,
            message: "Producto creado",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error creando producto", error: error.message });
    }
};

exports.readAll = async (req, res) => {
    try {
        const products = await Product.find({}).populate("user", "name email").sort({ createdAt: -1 });
        return res.status(200).json({ ok: true, products });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error leyendo productos", error: error.message });
    }
};

exports.readOne = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("user", "name email");
        if (!product) {
            return res.status(404).json({ ok: false, message: "Producto no encontrado" });
        }
        return res.status(200).json({ ok: true, product });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error leyendo producto", error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ ok: false, message: "Producto no encontrado" });
        }
        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ ok: false, message: "No tienes permisos para editar este producto" });
        }
        const update = {};
        if (req.body.name !== undefined) update.name = String(req.body.name).trim();
        if (req.body.description !== undefined) update.description = String(req.body.description).trim();
        if (req.body.price !== undefined) update.price = Number(req.body.price);
        const updated = await Product.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            ok: true,
            message: "Producto actualizado",
            product: updated
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error actualizando producto", error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ ok: false, message: "Producto no encontrado" });
        }
        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ ok: false, message: "No tienes permisos para borrar este producto" });
        }
        await Product.findByIdAndDelete(id);
        return res.status(200).json({ ok: true, message: "Producto eliminado" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error eliminando producto", error: error.message });
    }
};
