const prisma = require('../prisma/db')

async function getSalesCollection() {
  // try {
  //   const sales = await prisma.sales.findMany({
  //     take: 2,
  //   })
  //   console.log(sales)
  //   return sales
  // } catch (error) {
  //   console.error(error)
  // }
}

module.exports = { getSalesCollection }
