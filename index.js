const express = require("express");
const dotenv = require("dotenv").config();
const route = require("./Router/router");
const sequelize = require("./database");


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', route)

sequelize.sync();

const PORT = process.env.PORT || 1200;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})