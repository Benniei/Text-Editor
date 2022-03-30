express = require('express')
cors = require('cors')
app = express()

IP = "localhost"
PORT = 3000

// Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({ origin:true, credentials:true }));
 
// Routers
const textRouter = require('./routes/text-router')
app.use('/', textRouter)

app.get("/", (req, res) => {
    res.send("owo")
})

// Init our Database Object
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Listen
app.listen(PORT, IP, () => console.log("Server running on port " + PORT))