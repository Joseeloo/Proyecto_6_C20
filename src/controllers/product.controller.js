const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { ok, fail } = require("../utils/response");
const { isValidObjectId } = require("../utils/validators");

exports.create = asyncHandler(async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || price === undefined) {
        return fail(res, { status: 400, message: "name y price son requeridos" });
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return fail(res, { status: 400, message: "price debe ser un número >= 0" });
    }
    const product = await Product.create({
        user: req.user.id,
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        price: numericPrice
    });
    return ok(res, { status: 201, message: "Producto creado", data: { product } });
});

exports.readAll = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate("user", "name email").sort({ createdAt: -1 });
    return ok(res, { data: { products } });
});

exports.readOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return fail(res, { status: 400, message: "ID inválido" });
    }
    const product = await Product.findById(id).populate("user", "name email");
    if (!product) {
        return fail(res, { status: 404, message: "Producto no encontrado" });
    }
    return ok(res, { data: { product } });
});

exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return fail(res, { status: 400, message: "ID inválido" });
    }
    const product = await Product.findById(id);
    if (!product) {
        return fail(res, { status: 404, message: "Producto no encontrado" });
    }
    if (product.user.toString() !== req.user.id) {
        return fail(res, { status: 403, message: "No tienes permisos para editar este producto" });
    }
    const update = {};
    if (req.body.name !== undefined) update.name = String(req.body.name).trim();
    if (req.body.description !== undefined) update.description = String(req.body.description).trim();
    if (req.body.price !== undefined) {
        const numericPrice = Number(req.body.price);
        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            return fail(res, { status: 400, message: "price debe ser un número >= 0" });
        }
        update.price = numericPrice;
    }
    const updated = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return ok(res, { message: "Producto actualizado", data: { product: updated } });
});

exports.remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return fail(res, { status: 400, message: "ID inválido" });
    }
    const product = await Product.findById(id);
    if (!product) {
        return fail(res, { status: 404, message: "Producto no encontrado" });
    }
    if (product.user.toString() !== req.user.id) {
        return fail(res, { status: 403, message: "No tienes permisos para borrar este producto" });
    }
    await Product.findByIdAndDelete(id);
    return ok(res, { message: "Producto eliminado" });
});
