import { Request, Response } from 'express';
import productService from './product.service';
import mongoose from 'mongoose';

export class ProductController {
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

  async getProductById(req: Request, res: Response) {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        message: 'Invalid product ID format',
        success: false,
      });
    }

    try {
      const product = await productService.getProductById(productId);

      if (!product) {
        // If no product is found
        res.status(404).json({
          message: 'Book not found!',
          success: false,
        });
      }

      res.status(200).json({
        message: 'Book retrieved successfully',
        success: true,
        data: product,
      });
    } catch (error) {
      // Generic server error
      res.status(500).json({
        message: 'An error occurred while retrieving the book',
        success: false,
        error: error.message || 'Unknown error',
      });
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

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        message: 'Invalid product ID format',
        success: false,
      });
    }

    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        updateData,
      );

      if (!updatedProduct) {
        // If no product is found
        res.status(404).json({
          message: 'Book not found!',
          success: false,
        });
      }

      res.status(201).json({
        message: 'Book updated successfully',
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the book',
        success: false,
        error: error.message || 'Unknown error',
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        message: 'Invalid product ID format',
        success: false,
      });
    }

    try {
      const deletedProduct = await productService.deleteProduct(productId);
      if (!deletedProduct) {
        // If no product is found
        res.status(404).json({
          message: 'Book not found!',
          success: false,
        });
      }

      res.status(201).json({
        message: 'Book deleted successfully',
        success: true,
        data: [],
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
