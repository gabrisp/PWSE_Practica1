require ('dotenv').config()

const express = require('express')
const cors = require('cors')

const dbConnect = require('./utils/dbConnect')
const router = require('./routes')


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use("/static", express.static("./static"))



const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bildy',
            version: '1.0.0',
            description: 'This is a CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`{
        STATUS: "Server is running",
        PORT: ${port},
        URL: http://localhost:${port}/api,
        }`);
});

dbConnect()