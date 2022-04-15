const auth = require('../auth')
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const url = require('url')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
dotenv.config();

function uniqueID() {
    return Math.floor(Math.random() * Date.now()).toString(36).slice(2)
}

let transporter = nodemailer.createTransport({
    sendmail: true,
    auth: {
        user: "cse356cloudpeek@outlook.com",
        pass: "Cloudpeek"
    }
})

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

        verified = false
        verifyKey = uniqueID()
        var verifyURL = "http://" + process.env.SERVERIP + "/users/verify?email=" + email + "&" + "key=" + verifyKey
        const newUser = new User({
            name, password, email, verified, verifyKey
        });
        const savedUser = await newUser.save();
        console.log(verifyURL)
        
        let info = await transporter.sendMail({
            from: '"Scallion Frog" <cloudpeek@pain.com>',
            to: email,
            subject: "Verification key",
            text: verifyURL
        });

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
                    error: true,
                    status: "ERROR",
                    errorMessage: "Please enter all required fields." 
                });
        }

        let existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(200)
                .json({ 
                    error: true,
                    status: "ERROR",
                    errorMessage: "No such username." 
                });
        }
        if (password !== existingUser.password) {
            return res
                .status(200)
                .json({ 
                    error: true,
                    status: "ERROR",
                    errorMessage: "Wrong password." 
                });
        }
        if (!existingUser.verified) {
            return res
                .status(200)
                .json({ 
                    error: true,
                    status: "ERROR",
                    errorMessage: "User not verified." 
                });
        }
        // username real, password correct
        const token = auth.signToken(existingUser);

        return res.cookie("token", token, {
        }).status(200).json({
            status: "OK",
            name: existingUser.name,
            user: {
                name: existingUser.name,
                email: existingUser.email
            }
        }).send();

    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async(req, res) => {
    try {
        return res.clearCookie('token').status(200).json({status: "OK"}).send();
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

verifyUser = async(req, res) => {
    var email = url.parse(req.url, true).query.email;
    const key = url.parse(req.url, true).query.key;
    email = email.replace(" ","+")
    const existingUser = await User.findOne({ email: email });
    if(existingUser){
        if(existingUser.verifyKey === key){
            existingUser.verified = true;
            existingUser.save().then(() => {
                return res.status(200).json({
                    status: "OK",
                    email: email,
                    message: 'User updated!'
                })
            })
        }else{
            return res.status(200).json({
                status: "ERROR",
            }).send()
        }
    }
    else{
        return res.status(200).json({
            status: "ERROR",
        }).send()
    }
}

userLoggedIn = async (req, res) => {
    if(req.email || req.cookies.token){
        auth.verify(req, res, async function () {
            let verified = null;
            let loggedInUser = null;
            if(req.cookies.token) {
                verified = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                loggedInUser = await User.findOne({ email: verified.email });
                if(!loggedInUser){
                    loggedInUser = await User.findOne({ email: req.email });
                }
            }
            else{
                loggedInUser = await User.findOne({ _id: req.userId });
            }
            if(loggedInUser){
                return res.status(200).json({
                    loggedIn: true,
                    user: {
                        name: loggedInUser.name,
                        email: loggedInUser.email
                    }
                });
            }
        })
    }
    else{
        return res.status(400).json({
            errorMessage: "Not Logged In"
        }).send();
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    userLoggedIn
}
