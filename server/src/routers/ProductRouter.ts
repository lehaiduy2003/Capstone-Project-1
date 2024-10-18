// import ProductController from "../controllers/ProductController";
// import authenticateToken from "../middlewares/authMiddleware";
// import checkCache from "../middlewares/cacheMiddleware";
// import BaseRouter from "./OriginRouter";

// export default class ProductRouter extends BaseRouter {
//   private readonly productController: ProductController;
//   constructor() {
//     super();
//     this.productController = new ProductController();
//   }
//   public init(): void {
//     this.getRouter().get("/products", authenticateToken, this.productController.get);
//     this.getRouter().get("/products/search", authenticateToken, checkCache, this.productController.search);
//   }
// }
