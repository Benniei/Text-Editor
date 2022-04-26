express = require('express')
cors = require('cors')
app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require("path");
const fileupload = require('express-fileupload')
dotenv.config();

IP = process.env.BACKENDIP
PORT = 4000

// Middleware
app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json({limit: '10mb'}))
app.use(cors({ origin: ['http://cloud-peak.cse356.compas.cs.stonybrook.edu', 'http://209.151.154.192', "http://localhost:3000"],
         credentials:true 
}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.json());
app.use(fileupload())
app.use('/images', express.static(path.join(__dirname, ".", "public", "images")));

// Routers
const textRouter = require('./routes/text-router-noauth.js')
app.use('/', textRouter) 
app.use((req, res, next) => {
    console.log('Request Type:', req.method, req.path);
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
  

// Init mongoDB Object
const mongoose = require('./db/mongoose.js')
mongoose.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Listen
app.listen(PORT, IP, () => console.log("Server running on port " +IP +  PORT))
