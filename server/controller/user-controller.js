const auth = require('../auth')
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')

registerUser = async(req, res) => {
    try {
        const { name, password, email} = req.body;
        if (!name || !password || !email) {
            return res
                .status(200)
                .json({
                    status: "ERROR",
                    errorMessage: "Please enter all required fields."
                });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(200)
                .json({
                    status: "ERROR",
                    errorMessage: "An account with this username / email address already exists."
                });
        }
        verified = false
        
        const newUser = new User({
            name, password, email, verified
        });
        const savedUser = await newUser.save();
        await res.status(200).json({
            status: "OK",
            user: {
                name: savedUser.name,
                email: savedUser.email,
                verified: savedUser.verified
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res
                .status(200)
                .json({ 
                    status: "ERROR",
                    errorMessage: "Please enter all required fields." 
                });
        }

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res
                .status(200)
                .json({ 
                    status: "ERROR",
                    errorMessage: "No such username." 
                });
        }
        if (password !== existingUser.password) {
            return res
                .status(200)
                .json({ 
                    status: "ERROR",
                    errorMessage: "Wrong password." 
                });
        }
        if (!existingUser.verified) {
            return res
                .status(200)
                .json({ 
                    status: "ERROR",
                    errorMessage: "User not verified." 
                });
        }
        // username real, password correct
        const token = auth.signToken(existingUser);
         res.cookie("token", token, {
            httpOnly: false
        })
        return res.status(200).json({
            status: "OK",
            user: {
                email: existingUser.email,
                password: existingUser.password
            }
        }).send();

    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async(req, res) => {
    try {
        if(req.cookies.token)
            return res.clearCookie('token').status(200).json({status: "OK"}).send();
        else
            return res.status(200).json({status: "OK"}).send();
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

verifyUser = async(req, res) => {
    try {
        const { email, key } = req.body;
        if (key === "abracadabra") {
            const existingUser = await User.findOne({ email: email });
            existingUser.verified = true;
            existingUser.save().then(() => {
                return res.status(200).json({
                    status: "OK",
                    email: email,
                    message: 'User updated!'
                })
            })
            .catch(error => {
                return res.status(200).json({
                    error,
                    message: 'User not updated!'
                })
            })
        }
        else {
            res.status(200).json({
                status: "ERROR",
            }).send()
        }
    }
    catch (err) {
        res.status(200).send();
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser
}
