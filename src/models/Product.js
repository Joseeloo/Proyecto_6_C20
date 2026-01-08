const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
