const mongoose = require("mongoose");

require("dotenv").config();

const url = `mongodb+srv://yanso1:${process.argv[2]}@phonebook-test.byft3p1.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`Mongo started on ${conn.connection.host}`);
  } catch (err) {
    console.error("ERROR:", err);
  }
};

connectDB();

const terminalName = process.argv[3];
const terminalNumber = process.argv[4];

// mongoose model erstellen

const personSchema = new mongoose.Schema({
  name: { type: String },
  number: { type: String },
});
const Person = mongoose.model("Person", personSchema);

const newPerson = new Person({ name: terminalName, number: terminalNumber });

if (process.argv.length <= 3) {
  Person.find({}).then((persons) => {
    console.log(persons);
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
