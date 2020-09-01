const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    //to encrypt password ,we should install bcrypt package
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user
            .save()
            .then((result) => {
                res.status(200).json({
                    message: "user created!",
                    result: result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then((user) => {
            //stpe1: check user with the email exist in db or not
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed!( user does not exist)",
                });
            }

            fetchedUser = user;
            //step2: compare incoming pass with stored pass in database
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed! (password does not match)",
                });
            }

            //step3: create token based on info given to it {email: user.email, userId: user._id} ,after check validity of password
            //token was expired after 1 hour
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
                "secret_this_should_be_longer", { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Invalid authentication credentials!",
                error: err,
            });
        });
}