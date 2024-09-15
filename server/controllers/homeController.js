const { getAllSales } = require("../services/homeService")

async function getHomepage(req, res) {

  const sales = await getAllSales();
  res.status(200).send({ data: sales });
}

module.exports = { getHomepage }