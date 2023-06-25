const express = require("express");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

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

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Test Name",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const today = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${today}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    // res.send(`<h1>person with id ${id} was not found</h1>`);
    res.status(404).send({ error: "Did not work!" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log("body:", body);

  const person = {
    id: uuidv4(),
    name: body.name,
    number: body.number,
  };

  const find = persons.some((item) => item.name === person.name);

  if (find) {
    return res.status(400).json({
      error: "name already exists in the phonebook",
    });
  } else if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }

  persons.push(person);

  res.json(person);
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
