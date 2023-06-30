const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING);
    console.log(`Mongo started on ${conn.connection.host}`);
  } catch (err) {
    console.error("ERROR:", err);
  }
};

module.exports = connectDB;
