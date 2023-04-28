require("dotenv").config();

const express = require("express");

const app = express();
const port = 3000;

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("open the database"));

app.use(express.json());

const pizzaRouter = require("./routes/pizza");
const pizzeriaRouter = require("./routes/pizzeria");

app.use("/pizza", pizzaRouter);
app.use("/pizzeria", pizzeriaRouter);

app.listen(port);
