const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const SubCategory = require("../models/subCategoryModel");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      images,
      sizes,
      colors,
      material,
      gender,
    } = req.body;

    // Required fields
    if (
      !name?.trim() ||
      !description?.trim() ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({ success: false, message: "Required fields are missing", });
    }

    // Validate numbers
    if (price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0", });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative", });
    }

    // Validate category
    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found", });
    }

    // Validate subcategory
    if (subCategory) {
      const subCategoryExists = await SubCategory.findOne({
        _id: subCategory,
        category,
        isActive: true,
      });

      if (!subCategoryExists) {
        return res.status(400).json({ success: false, message: "SubCategory not found or does not belong to selected category", });
      }
    }

    const product = await Product.create({
      name,
      description: description.trim(),
      brand,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      material,
      gender,
    });

    return res.status(201).json({ success: true, message: "Product created successfully", data: product, });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Product name or SKU already exists", });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({ success: false, message: messages.join(", "), });
    }

    return res.status(500).json({ success: false, message: error.message || "Server Error", });
  }
};


// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, results: products.length, data: products, });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    res.status(200).json({ success: true, data: product, });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    res.status(200).json({ success: true, message: "Product updated successfully", data: product, });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const toggleProductActiveStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    product.isActive = !product.isActive;

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? "activated" : "deactivated"} successfully`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully", });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  toggleProductActiveStatus,
  deleteProduct,
};