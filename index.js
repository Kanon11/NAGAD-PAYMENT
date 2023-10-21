const {PORT}=require("./config/env.config")

const express = require("express");
const app = express();
process.env.TZ = 'Asia/Dhaka'; 


const cors = require("cors");
let corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    res.status(200).send({message:`welcome to home of ngp`});
});
require('./routes/general.route')(app);

app.listen(PORT, () => {
    console.log(`Nagad-Payment run on http://localhost:${PORT}`)
})