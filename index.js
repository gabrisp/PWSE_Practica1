require ('dotenv').config()

const express = require('express')
const cors = require('cors')

const dbConnect = require('./utils/dbConnect')
const router = require('./routes')

const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.listen(port, () => {
    console.log(`{
        STATUS: "Server is running",
        PORT: ${port},
        URL: http://localhost:${port}/api,
        }`);
});

dbConnect()