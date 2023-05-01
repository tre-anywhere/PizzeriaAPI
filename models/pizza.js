const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  toppings: [{topping: String}]
});

module.exports = mongoose.model("Pizza", pizzaSchema);
