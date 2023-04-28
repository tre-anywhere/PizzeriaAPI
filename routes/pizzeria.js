const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const Pizzeria = require("../models/pizzeria");

const jsonParser = bodyParser.json();

// Pizzeria default values
let pizzeria = { name: "Pizzeria Pie", phone: "555-555-5555", rating: 0 };

async function getPizzeria(req, res, next) {
  try {
    pizzeria = await Pizzeria.findById(req.params.id);
    res.pizzeria = pizzeria;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  next();
}

router.get("/", jsonParser, async (req, res) => {
  try {
    const listofPizzerias = await Pizzeria.find();
    res.json(listofPizzerias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getPizzeria, async (req, res) => {
  res.json(res.pizzeria);
});

router.post("/", jsonParser, async (req, res) => {
  pizzeria = new Pizzeria(req.body);
  try {
    const newPizzeria = await pizzeria.save();
    res.status(201).json(newPizzeria);
  } catch (err) {
    res.status(400).json({
      message: `${err.message}Sorry you won't be able to order Pizzeria today. All orders must have a name and description. ${err.name}`,
    });
  }
});

router.patch("/:id/userrating", getPizzeria, jsonParser, async (req, res) => {
  const { userrating } = req.body;

  const pizzeriaToUpdate = res.pizzeria;

  if (pizzeriaToUpdate.name) {
    pizzeriaToUpdate.ratings.push({ userrating });
    pizzeriaToUpdate.save();

    res.status(200).send("update saved");
  } else {
    res.status(400).send("Update Failed! Invalid Pizzeria Name");
  }
});

router.delete("/:id", getPizzeria, async (req, res) => {
  // delete the pizzeria by id with mongoose
  const { id } = req.params;

  try {
    const pizzeriaToDelete = await Pizzeria.findById(id);
    if (!pizzeriaToDelete) {
      return res.status(404).send("Pizzeria not found");
    }

    await Pizzeria.findOneAndDelete({ _id: id });
    res.status(200).send("Pizzeria Deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  return console.log("Pizzeria not found");
});

router.patch("/:id", getPizzeria, jsonParser, async (req, res) => {
  pizzeria = new Pizzeria(req.body);

  const pizzeriaToUpdate = res.pizzeria;

  if (pizzeria.name) {
    pizzeriaToUpdate.name = pizzeria.name;
    pizzeriaToUpdate.phone = pizzeria.phone;
    pizzeriaToUpdate.save();
    res.status(204).send(pizzeria);
  } else {
    res
      .status(404)
      .send(
        "Unable to update this Pizzeria Pie!! The request must include a 'NAME'."
      );
  }
});

module.exports = router;

/* 
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const Pizzeria = require("../models/pizzeria");

const jsonParser = bodyParser.json();

// Pizzeria default values
let pizzeria = { name: "Pizzeria Pie", phone: "555-555-5555", rating: 0, ratings: [] };

async function getPizzeria(req, res, next) {
  try {
    pizzeria = await Pizzeria.findById(req.params.id);
    res.pizzeria = pizzeria;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  next();
}

router.get("/", jsonParser, async (req, res) => {
  try {
    const listofPizzerias = await Pizzeria.find();
    res.json(listofPizzerias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getPizzeria, async (req, res) => {
  res.json(res.pizzeria);
});

router.post("/", jsonParser, async (req, res) => {
  pizzeria = new Pizzeria(req.body);
  try {
    const newPizzeria = await pizzeria.save();
    res.status(201).json(newPizzeria);
  } catch (err) {
    res.status(400).json({
      message: `${err.message}Sorry you won't be able to order Pizzeria today. All orders must have a name and description. ${err.name}`,
    });
  }
});

router.patch("/:id/userrating", getPizzeria, jsonParser, async (req, res) => {
  const { userrating } = req.body;

  const pizzeriaToUpdate = res.pizzeria;

  if (pizzeriaToUpdate.name) {
    pizzeriaToUpdate.ratings.push(userrating);
    pizzeriaToUpdate.save();

    res.status(200).send("update saved");
  } else {
    res.status(400).send("Update Failed! Invalid Pizzeria Name");
  }
});

router.delete("/:id", getPizzeria, async (req, res) => {
  // delete the pizzeria by id with mongoose
  const { id } = req.params;

  try {
    const pizzeriaToDelete = await Pizzeria.findById(id);
    if (!pizzeriaToDelete) {
      return res.status(404).send("Pizzeria not found");
    }

    await Pizzeria.findOneAndDelete({ _id: id });
    res.status(200).send("Pizzeria Deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  return console.log("Pizzeria not found");
});

router.patch("/:id", getPizzeria, jsonParser, async (req, res) => {
  pizzeria = new Pizzeria(req.body);

  const pizzeriaToUpdate = res.pizzeria;

  if (pizzeria.name) {
    pizzeriaToUpdate.name = pizzeria.name;
    pizzeriaToUpdate.phone = pizzeria.phone;
    pizzeriaToUpdate.save();
    res.status(204).send(pizzeria);
  } else {
    res
 */
