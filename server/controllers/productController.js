const { getHomepageProducts } = require("../services/productService");

async function getHomepage(req, res) {
  const products = await getHomepageProducts();
  res.status(200).send({ products });
}

module.exports = { getHomepage };
