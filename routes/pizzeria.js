const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const Pizzeria = require("../models/pizzeria");

const jsonParser = bodyParser.json();

let pizzeria = {};
async function getPizzeria(req, res, next) {
  // if (!req.params.userRating) {
  //   return res.status(400).send("userRating is required");
  // }

  console.log("getPizzeria res.body", res.body);
  console.log("getPizzeria req.params", req.params);

  try {
    pizzeria = await Pizzeria.findById(req.params.id);
    if (!pizzeria) {
      return res.status(404).json({ message: "Pizzeria not found" });
    }
    res.pizzeria = pizzeria;
    return next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    return next(err);
  }
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

router.patch("/userrating/:id", getPizzeria, jsonParser, async (req, res) => {
  const userrating = req.body.userRating;

  const pizzeriaToUpdate = res.pizzeria;

  if (pizzeriaToUpdate?.name) {
    pizzeriaToUpdate.ratings.push({ usrRating: userrating });
    pizzeriaToUpdate.save();
    res.status(200).send("Your rating has been registered.");
  } else {
    res
      .status(400)
      .send(
        "Your pizzeria update was no good. Your request must include a userRating!"
      );
  }
});

// UPDATE pizzeria details
router.patch("/:id", getPizzeria, jsonParser, async (req, res) => {
  console.log("router.patch(/:id)");
  const pizzeriaToUpdate = res.pizzeria;
  const newName = req.body.name;

  if (pizzeriaToUpdate?.name) {
    try {
      pizzeriaToUpdate.name = newName;
      const updatedPizzeria = await pizzeriaToUpdate.save();
      res.status(200).json(updatedPizzeria);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Pizzeria needs a name before it can be updated" });
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
