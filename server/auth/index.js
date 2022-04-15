const jwt = require("jsonwebtoken")

function authManager() {
    verify = function (req, res, next) {
        try {
            const token = req.cookies.token;
            // console.log("auth", req.cookies, req.path)
            if (!token) {
                return res.status(401).json({
                    error: true,
                    status: "ERROR",
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.email = verified.email;

            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                error:true,
                status: "ERROR",
                errorMessage: "Unauthorized"
            });
        }
    }

    signToken = function (user) {
        return jwt.sign({
            email: user.email,
            name: user.name
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;