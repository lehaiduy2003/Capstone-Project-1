const { getHomepageData } = require("../services/homeService");

async function getHomepage(req, res) {
  try {
    const homepageData = await getHomepageData();
    res.status(200).send(homepageData);
  } catch (error) {
    console.error("Error handling homepage request:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { getHomepage };
