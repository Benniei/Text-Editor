const auth = require('../auth')
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const url = require('url')
const dotenv = require('dotenv')
// const nodemailer = require('nodemailer')
dotenv.config();

function uniqueID() {
    return Math.floor(Math.random() * Date.now()).toString(36).slice(2)
}

// var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "d34ee7fb72463e",
//       pass: "2c9ba98f07b09d"
//     }
//   });

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
        verifyKey = uniqueID()
        var verifyURL = "http://" + process.env.IP + ":4000/users/verify?email=" + email + "&" + "key=" + verifyKey
        const newUser = new User({
            name, password, email, verified, verifyKey
        });
        const savedUser = await newUser.save();
        console.log(verifyURL)
        // Send Email
        // const buildHTML = "<a href=" + verifyURL + ">" + verifyURL + "</a> "
        // const message = {
        //     from: 'CSE356@cs.com', // Sender address
        //     to: 'bennie.chen@stonybrook.edu',         // List of recipients
        //     subject: 'Verification key', // Subject line
        //     html: buildHTML// Plain text body
        // };
        // transport.sendMail(message, function(err, info) {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       console.log(info);
        //     }
        // });
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

        let existingUser = await User.findOne({ email: email });
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
        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            status: "OK",
            user: {
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
    try {
        console.log(req.url)
        const email = url.parse(req.url, true).query.email;
        const key = url.parse(req.url, true).query.key;
        console.log(email, key)
        const existingUser = await User.findOne({ email: email });
        if(existingUser){
            console.log(existingUser)
            if(existingUser.verifyKey === key){
                existingUser.verified = true;
                console.log(existingUser)
                existingUser.save().then(() => {
                    return res.status(200).json({
                        status: "OK",
                        email: email,
                        message: 'User updated!'
                    })
                })
            }else{
                res.status(200).json({
                    status: "ERROR",
                }).send()
            }
        }
        else{
            res.status(200).json({
                status: "ERROR",
            }).send()
        }
    }
    catch (err) {
        res.status(200).send();
    }
}

userLoggedIn = async (req, res) => {
    try{
        if(req.userId || req.cookies){
            auth.verify(req, res, async function () {
                const loggedInUser = await User.findOne({ _id: req.userId });
                return res.status(200).json({
                    loggedIn: true,
                    user: {
                        name: loggedInUser.name,
                        email: loggedInUser.email
                    }
                });
            })
        }
        else{
            return res.status(200).json({
                status: "ERROR",
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    userLoggedIn
}
