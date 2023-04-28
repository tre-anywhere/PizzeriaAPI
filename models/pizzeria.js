const mongoose = require("mongoose");

const pizzeriaSchema = new mongoose.Schema({
  name: { type: String, default: "Pizzeria Pie" },
  phone: { type: String, default: "555-555-5555" },
  website: { type: String, default: "https://www.pizzeriapie.com" },
  address: {
    street: { type: String, default: "123 Main St" },
    city: { type: String, default: "Anytown" },
    state: { type: String, default: "NY" },
    postalCode: { type: String, default: "10001" },
  },
  rating: { type: Number, default: 0 },
  ratings: [{ userRating: { type: Number, default: 0 } }],
});

module.exports = mongoose.model("Pizzeria", pizzeriaSchema);
