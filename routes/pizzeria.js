const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const Pizzeria = require("../models/pizzeria");

const jsonParser = bodyParser.json();

// Pizzeria default values
let pizzeria = {};

async function getPizzeria(req, res, next) {
  try {
    pizzeria = await Pizzeria.findById(req.params.id);
    if (!pizzeria) {
      return res.status(404).json({ message: "Pizzeria not found" });
    }
    res.pizzeria = pizzeria;
    return next();
  } catch (err) {
    return next(err);
  }
}

/* 
async function getPizzeria(req, res, next) {
  try {
    pizzeria = await Pizzeria.findById(req.params.id);
    if (!pizzeria) {
      return res.status(404).json({ message: "Pizzeria not found" });
    }
    res.pizzeria = pizzeria;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  return next();
}
 */
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

  if (typeof userrating === "number") {
    pizzeriaToUpdate.ratings.push({ userRating: userrating });

    try {
      const updatedPizzeria = await pizzeriaToUpdate.save();
      res.status(200).json(updatedPizzeria);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: "Invalid user rating" });
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

module.exports = router;
