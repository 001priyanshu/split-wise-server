const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(
  process.env.DATABASE
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error on connecting to database"));

db.once("open", () => {
  console.log("Succesfully connected to database");
});
