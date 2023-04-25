const jwt = require("jsonwebtoken");
module.exports = jwtMaker = (value, res, statusCode) => {
    // options for cokie
    const options = {
        expires: new Date(
            Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true,
    };
    value = jwt.sign({ value }, process.env.jWT_SECRETE, { expiresIn: process.env.JWT_EXPIRE });
    res.status(statusCode).cookie("token", value, options).json({
        success: true,
        value
    });
};