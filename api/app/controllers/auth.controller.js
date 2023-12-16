const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

        req.session.token = token;

        res.status(200).send({
            id: user._id,
            email: user.email,
            token: token
        });
    } catch (err) {
        console.log('Error while logging in:', err);

        res.status(500).send({
            message: "Error while logging in"
        });

        return;
    }
};
