const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const Pizza = require("../models/pizza");

const jsonParser = bodyParser.json();

async function getPizza(req, res, next) {
  try {
    const pizza = await Pizza.findById(req.params.id);
    res.pizza = pizza;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  next();
}

router.get("/", jsonParser, async (req, res) => {
  try {
    const listofPizzas = await Pizza.find();
    res.json(listofPizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getPizza, async (req, res) => {
  // Get the given pizza for the passed in 'id'
  if (!res.pizza) {
    return res.send("No Pizza Pie! Try again.");
  }
  res.json(res.pizza);
});

router.post("/", jsonParser, (req, res) => {
  const pizza = new Pizza(req.body);

  if (pizza.name && pizza.description) {
    pizza.save();
    res.status(201).send(pizza);
  } else {
    res
      .status(401)
      .send(
        "Sorry you won't be able to order Pizza today. All orders must have a name and description."
      );
  }
});

router.patch("/:id", getPizza, jsonParser, async (req, res) => {
  const pizza = new Pizza(req.body);

  const pizzaToUpdate = res.pizza;

  if (pizza.name) {
    pizzaToUpdate.name = pizza.name;
    // pizzaToUpdate.description = pizza.description;
    pizzaToUpdate.save();
    res.status(204).send(pizza);
  } else {
    res
      .status(404)
      .send(
        "Unable to update this Pizza Pie!! The request must include a 'NAME'."
      );
  }
});

router.delete("/:id", getPizza, async (req, res) => {
  let deletedPizza;
  const { pizza } = res;
  const { id } = req.params;

  if (!pizza?.name) {
    res.status(404).send("Cannot find the pizza for the id: ", req.params.id);
  }

  try {
    deletedPizza = await Pizza.findByIdAndDelete(id);
    res.status(204).send(deletedPizza);
  } catch (err) {
    res.status(401).send(`Sorry unable to Delete Pizza id: ${req.params.id}`);
  }
});

module.exports = router;
