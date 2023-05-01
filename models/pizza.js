const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model("Pizza", pizzaSchema);
