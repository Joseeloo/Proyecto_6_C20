exports.ok = (res, { status = 200, message = "OK", data = null } = {}) => {
    return res.status(status).json({ ok: true, message, data });
};

exports.fail = (res, { status = 400, message = "Error", errors = null } = {}) => {
    return res.status(status).json({ ok: false, message, errors });
};
