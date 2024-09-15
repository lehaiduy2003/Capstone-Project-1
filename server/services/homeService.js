const { getSalesCollection } = require("../repositories/homeRepository");

function getAllSales() {
  return getSalesCollection();
}

module.exports = { getAllSales };