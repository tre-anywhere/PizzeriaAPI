const mongoose = require("mongoose");

const pizzeriaSchema = new mongoose.Schema({
  name: { type: String, default: "Pizzeria Pie" },
  phone: { type: String, default: "000-000-0000" },
  website: { type: String, default: "https://www.pizzeri-pie.com" },
  address: {
    street: { type: String, default: "321 Sunset Cliffs Ave" },
    city: { type: String, default: "San Diego" },
    state: { type: String, default: "CA" },
    postalCode: { type: String, default: "98765" },
  },
  rating: { type: Number, default: 5 },
  ratings: [{ userRating: { type: Number, default: 0 } }],
});

module.exports = mongoose.model("Pizzeria", pizzeriaSchema);
