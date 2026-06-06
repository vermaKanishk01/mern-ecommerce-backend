const Category = require("../models/categoryModel");
const slugify = require("slugify");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await Category.create({
      name,
      description,
      image,
      isActive,
      slug: slugify(name, { lower: true }),
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "category already exists.", });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("name");

    res.status(200).json({ success: true, results: categories.length, data: categories, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Single Category (by slug)
const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Category
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (name) {
      req.body.slug = slugify(name, { lower: true });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// toggle active status
const setCategoryActiveStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found", });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"} successfully`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  setCategoryActiveStatus,
}