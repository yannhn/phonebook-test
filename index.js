const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const Person = require("./models/person");
const connectDB = require("./config/connectDB");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

morgan.token("object", function (req, res) {
  return `${JSON.stringify(req.body)}`;
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :object"
  )
);

app.use(express.static("dist"));

connectDB();

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
    console.log("PERSONS FROM GET:", persons);
  });
});

app.get("/api/info", (req, res) => {
  const today = new Date();
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${today}</p>
    `);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: "Did not work!" });
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.name,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
