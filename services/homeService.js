const { getLatestProducts } = require("../repositories/homeRepository");

async function getHomepageData() {
  try {
    const latestProducts = await getLatestProducts();

    return {
      latestProducts,
    };
  } catch (error) {
    console.error("Error getting homepage data:", error);
    throw error;
  }
}

module.exports = {
  getHomepageData,
};
