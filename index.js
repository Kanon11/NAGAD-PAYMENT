const {PORT}=require("./config/env.config")

const express = require("express");
const app = express();



const cors = require("cors");
let corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('./routes/general.route')(app);

app.listen(PORT, () => {
    console.log(`Nagad-Payment run on http://localhost:${PORT}`)
})