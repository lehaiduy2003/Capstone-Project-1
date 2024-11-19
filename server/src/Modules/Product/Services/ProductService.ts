import { Product } from "../../../libs/zod/model/Product";
import { Filter } from "../../../libs/zod/Filter";

import { DeleteResult, ObjectId } from "mongodb";
import SessionService from "../../../Base/SessionService";
import { ProductDTO, validateProductDTO } from "../../../libs/zod/dto/ProductDTO";
import productsModel from "../Models/productsModel";
import { PipelineStage } from "mongoose";

export default class ProductService extends SessionService {
  public constructor() {
    super();
  }

  // Get the list of products by the list of product ids
  async findProductsList(ids: ObjectId[]): Promise<Product[]> {
    const products = await productsModel.find({ _id: { $in: ids } }).lean();
    return products;
  }

  async findMany(filter: Filter): Promise<ProductDTO[] | null> {
    const products = await productsModel
      .find({
        status: true,
        quantity: { $gte: 1 },
      })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // console.log(products);

    return products.map(validateProductDTO);
  }

  public async search(filter: Filter): Promise<ProductDTO[] | null> {
    const order = filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const aggregationPipeline: PipelineStage[] = [];

    // Add a $search stage if query name is provided
    if (filter.query) {
      aggregationPipeline.push({
        $search: {
          index: "product_name",
          text: {
            query: filter.query,
            path: "name",
            fuzzy: { maxEdits: 2 },
          },
        },
      });
    }

    // Add a $match stage to filter by type if filter.type is provided
    if (filter.type) {
      aggregationPipeline.push({
        $match: { type: filter.type },
      });
    }

    // Add a $match stage to filter by status and quantity
    aggregationPipeline.push({
      $match: {
        status: true,
        quantity: { $gte: 1 },
      },
    });

    aggregationPipeline.push(
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip }
    );

    const products: Product[] = await productsModel.aggregate(aggregationPipeline);

    return products.map(validateProductDTO);
  }

  public async findById(id: ObjectId): Promise<Product | null> {
    return await productsModel.findOne({ _id: id }).lean();
  }
}
