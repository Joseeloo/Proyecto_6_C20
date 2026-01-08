const { fail } = require("../utils/response.js");

module.exports = (err, req, res, next) => {
    console.error("Error:", err.message);
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return fail(res, { status: 400, message: "Validation error", errors });
    }
    if (err.code === 11000) {
        const fields = Object.keys(err.keyValue || {});
        return fail(res, {
            status: 409,
            message: `Duplicate key: ${fields.join(", ")}`,
            errors: err.keyValue
        });
    }
    return fail(res, {
        status: err.statusCode || 500,
        message: err.statusCode ? err.message : "Internal server error"
    });
};
