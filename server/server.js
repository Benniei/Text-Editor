express = require('express')
app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require("path");
const fileupload = require('express-fileupload')
dotenv.config();

IP = process.env.IP
PORT = 4000

// Middleware
app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json({limit: '10mb'}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.json());
app.use(fileupload());
app.use('/images', express.static(path.join(__dirname, ".", "public", "images")));
 
// Routers
const textRouter = require('./routes/text-router')
app.use('/', textRouter) 
app.use((req, res, next) => {
    console.log('Request Type:', req.method, req.path);
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
  

// Init mongoDB Object
const mongoose = require('./db/mongoose.js')
mongoose.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Listen
app.listen(PORT, IP, () => console.log("Server running on port " + PORT))