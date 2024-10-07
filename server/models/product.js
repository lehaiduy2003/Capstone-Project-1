// server/models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
