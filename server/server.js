express = require('express')
cors = require('cors')
app = express()
const dotenv = require('dotenv')
dotenv.config();

IP = process.env.IP
PORT = 4000

// Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({ origin:true, credentials:true }));
 
// Routers
const textRouter = require('./routes/text-router')
app.use('/', textRouter) 

// Listen
app.listen(PORT, IP, () => console.log("Server running on port " + PORT))