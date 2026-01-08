const mongoose = require("mongoose");

exports.isValidObjectId = (id) => mongoose.isValidObjectId(id);

exports.isValidEmail = (email) => {
    if (!email) return false;
    const v = String(email).trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};
