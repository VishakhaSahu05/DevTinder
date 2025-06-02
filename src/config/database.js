const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://NamasteDev:Qx97EVVc8PTPymJk@namastenode.qtxdlgn.mongodb.net/devTinder");
};

module.exports = connectDB;
