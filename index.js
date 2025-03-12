const express = require('express')
const cors = require('cors')
const dbConnect = require('./utils/mongo')

require ('dotenv').config()


const app = express();


app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

dbConnect()