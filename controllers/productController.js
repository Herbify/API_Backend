const prisma = require("../prisma");

class ProductController {
  static async getProductList(req, res) {
    try {
      const { limit = 10, page = 1 } = req.query;

      const offset = (page - 1) * limit;
      const data = await prisma.product.findMany({
        take: Number(limit),
        skip: Number(offset),
      });

      res.status(200).json({
        message: "Successfully get all product list",
        limit: Number(limit),
        page: Number(page),
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getProductList",
        error: error.message,
      });
    }
  }
  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const data = await prisma.product.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        message: `Successfully get product with id = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getProductById",
        error: error.message,
      });
    }
  }
  static async createProduct(req, res) {
    try {
      const {
        name,
        description,
        image = "default-product.jpg",
        ingredients,
        link,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }
      if (!description) {
        return res.status(400).json({
          message: "Description is required",
        });
      }
      if (!ingredients) {
        return res.status(400).json({
          message: "Ingredients is required",
        });
      }

      const data = await prisma.product.create({
        data: {
          name,
          description,
          image,
          ingredients,
          link,
        },
      });

      res.status(201).json({
        message: "Successfully create new product",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:createProduct",
        error: error.message,
      });
    }
  }
  static async searchProductByIngredients(req, res) {
    try {
      const { ingredients } = req.query;

      const formatIngredients = ingredients.split(",");
      const whereIngredients = formatIngredients.map((word) => {
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        return { ingredients: { contains: capitalizedWord } };
      });

      const data = await prisma.product.findMany({
        where: {
          OR: whereIngredients,
        },
      });

      res.status(200).json({
        message: `Successfully get product`,
        ingredients: formatIngredients,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:searchProductByIngredients",
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
