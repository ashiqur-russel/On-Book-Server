import { Request, Response } from 'express';
import { ProductService } from './product.service';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        message: 'Books retrieved successfully',
        status: true,
        data: products,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Validation failed', success: false, error });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        message: 'Book created successfully',
        success: true,
        data: product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Validation failed', success: false, error });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { productId } = req.params;
    const updateData = req.body;
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        updateData,
      );
      res.status(201).json({
        message: 'Book updated successfully',
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Validation failed', success: false, error });
    }
  }
}

const productController = new ProductController();
export default productController;
