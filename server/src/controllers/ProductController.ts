import {Request, Response} from "express";

import BaseController from "./init/BaseController";
import ProductService from "../services/ProductService";
import saveToCache from "../libs/redis/cacheSaving";

export default class ProductController extends BaseController {
    private readonly productService: ProductService;

    public constructor(productService: ProductService) {
        super();
        this.productService = productService;
    }

    /**
     * get products (for no search query params (sort, order, find by, etc.) provided by user - homepage, user products, etc.)
     * @param req request containing query params (limit, skip, page)
     * @param res response containing products
     */
    public async getProducts(req: Request, res: Response): Promise<void> {
        if (!this.checkReqParams) return;
        try {
            const products = await this.productService.read(req.query);

            if (!products || products.length === 0) {
                res.status(404).send({message: "No products found"});
            } else res.status(200).send(products);
        } catch (error) {
            this.error(error, res);
        }
    }

    /**
     * for searching products based on query params (sort, order, find by, etc.)
     * @param req request containing query params (limit, skip, page, sort, order, find by, etc.)
     * @param res response containing products
     */
    async searchProducts(req: Request, res: Response): Promise<void> {
        if (!this.checkReqParams) return;
        try {
            const products = await this.productService.search(req.query);

            if (!products || products.length === 0) {
                res.status(404).send({message: "No products found"});
                return;
            }

            await saveToCache(req.body.cacheKey, 3600, products);

            res.status(200).send(products);
        } catch (error) {
            this.error(error, res);
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        if (!this.checkReqParams) return;
        try {
            const product = await this.productService.readOne(req.params.id);

            if (!product) {
                res.status(404).send({message: "Product not found"});
                return;
            }

            res.status(200).send(product);
        } catch (error) {
            this.error(error, res);
        }
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        if (!this.checkReqBody(req, res)) return;
        try {
            const product = await this.productService.createProduct(req.body);

            if (!product) {
                res.status(502).send({message: "Product not created"});
                return;
            }

            res.status(201).send(product);
        } catch (error) {
            this.error(error, res);
        }
    }

    async updateProductById(req: Request, res: Response): Promise<void> {
        if (!this.checkReqBody(req, res)) return;
        try {
            const isUpdated = await this.productService.updateProductById(req.params.id, req.body);

            if (!isUpdated) {
                res.status(502).send({message: "Product not updated"});
                return;
            }

            res.status(200).send({message: "Product updated"});
        } catch (error) {
            this.error(error, res);
        }
    }

    public async deleteProductById(req: Request, res: Response): Promise<void> {
        try {
            const isDeleted = await this.productService.deleteProduct(req.params.id); // Delete product

            if (!isDeleted) {
                res.status(404).json({message: "No products found"});
            } else {
                res.status(200).json({message: "Product deleted"});
            }
        } catch (error) {
            this.error(error, res);
        }
    }
}
