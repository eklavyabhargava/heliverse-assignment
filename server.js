require('dotenv').config();

const express = require('express')
const connectDb = require('./db')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8080

// connect to db
connectDb()

require('./models/quiz_model')

app.use(cors())
app.use(express.json())
app.use(require('./routes/quiz_routes'))

// start server
app.listen(port, () => console.log(`Server listening on port ${port}!`))