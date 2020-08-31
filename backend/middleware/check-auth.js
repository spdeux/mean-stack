const jwt = require("jsonwebtoken");

//middleware is a function which receive well-known arguments
module.exports = (req, res, next) => {
    //token is like this "Bearer dsfsfsgsgsg". so we need the second part that comes after Bearer

    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};