import { Request, Response } from 'express';
import productService from './product.service';

class ProductController {
  // Retirve all the products from database created
  async getAllProducts(req: Request, res: Response) {
    const searchTerm = req.query.searchTerm as string;
    try {
      const products = await productService.getAllProducts(searchTerm);
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

  // Fetch product by id
  async getProductById(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const product = await productService.getProductById(productId);

      res.status(200).json({
        message: 'Book retrieved successfully',
        success: true,
        data: product,
      });
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'ValidationError') {
        res.status(404).json({
          message: err.message,
          success: false,
        });
      } else {
        res.status(500).json({
          message: err.message,
          status: false,
          err,
          stack: err.stack,
        });
      }
    }
  }

  // Create product
  async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        message: 'Book created successfully',
        success: true,
        data: product,
      });
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'ValidationError') {
        res.status(500).json({
          message: err.message,
          success: false,
        });
      } else {
        res.status(400).json({
          message: 'Validation failed',
          success: false,
          error,
          stack: err.stack,
        });
      }
    }
  }

  // update product data; partial data also could be updated
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
      const err = error as Error;
      if (err.name !== 'ValidationError') {
        res.status(404).json({
          message: err.message,
          success: false,
        });
      } else {
        res.status(500).json({
          message: 'Validation failed',
          success: false,
          error,
          stack: err.stack,
        });
      }
    }
  }

  // Delete product using product id
  async deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      await productService.deleteProduct(productId);

      res.status(201).json({
        message: 'Book deleted successfully',
        success: true,
        data: {},
      });
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'ValidationError') {
        res.status(404).json({
          message: err.message,
          success: false,
          err,
          stack: err.stack,
        });
      } else {
        res.status(500).json({
          message: err.message,
          status: false,
          err,
          stack: err.stack,
        });
      }
    }
  }
}

const productController = new ProductController();
export default productController;
