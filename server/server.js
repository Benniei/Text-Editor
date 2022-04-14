express = require('express')
cors = require('cors')
app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require("path");
dotenv.config();

IP = process.env.IP
PORT = 4000

// Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({ origin: ["http://localhost:3000"],
         credentials:true 
}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static("public"));
 
// Routers
const textRouter = require('./routes/text-router')
app.use('/', textRouter) 
app.use((req, res, next) => {
    console.log(path.join(__dirname, "..", "client", "build", "index.html"))
    res.sendFile(path.join(__dirname, ".", "build", "index.html"));
});
  

// Init mongoDB Object
const mongoose = require('./db/mongoose.js')
mongoose.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Listen
app.listen(PORT, IP, () => console.log("Server running on port " + PORT))