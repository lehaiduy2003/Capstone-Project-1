const { getProducts } = require("../repositories/productRepository");

function getHomepageProducts() {
  return getProducts();
}

module.exports = { getHomepageProducts };
