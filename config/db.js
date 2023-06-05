const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(`This is in side connectDB ${process.env.MONGO_URI}`);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
