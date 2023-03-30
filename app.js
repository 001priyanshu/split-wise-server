const express = require("express");

const userRoute = require('./routes/userRoute');
const db = require("./config/mongoose");
const bodyParser = require('body-parser');


const app = express();
// app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(require('./utils/cors'));
app.use("/",userRoute);

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (err) {
      console.log("Error in starting the server", err);
    }
    console.log(`Server is running at port ${port}`);
  });