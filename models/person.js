const mongoose = require("mongoose");

require("dotenv").config();

const personSchema = new mongoose.Schema({
  name: { type: String },
  number: { type: String },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
