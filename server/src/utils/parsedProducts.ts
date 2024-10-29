import { CheckoutProductDTO, validateCheckoutProductDTO } from "../libs/zod/dto/CheckoutProductDTO";
import { Product } from "../libs/zod/model/Product";

const parseProducts = (products: Partial<Product>[]): CheckoutProductDTO[] => {
  return products
    .map((product: Partial<Product>) => validateCheckoutProductDTO(product))
    .filter((product: Partial<Product>): product is CheckoutProductDTO => product !== null);
};

export default parseProducts;
