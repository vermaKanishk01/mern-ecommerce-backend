const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const mongoose = require("mongoose");

// Create SubCategory
const createSubCategory = async (req, res) => {
  try {
    const { name, category, description, isActive } = req.body;

    // Check if parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.create({
      name,
      category,
      description,
      isActive,
      slug: slugify(name, { lower: true }),
    });

    res.status(201).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Sub-category already exists in this category", });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All SubCategories
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate("category", "name slug")
      .sort("name");

    res.status(200).json({
      success: true,
      results: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get SubCategories by Category
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      category: req.params.categoryId,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      results: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update SubCategory
const updateSubCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (name) {
      req.body.slug = slugify(name, { lower: true });
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const setSubCategoryActiveStatus = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found", });
    }

    subCategory.isActive = !subCategory.isActive;
    await subCategory.save();

    res.status(200).json({
      success: true,
      message: `SubCategory ${subCategory.isActive ? "activated" : "deactivated"} successfully`,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid SubCategory ID", });
    }

    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found", });
    }

    res.status(200).json({ success: true, message: "SubCategory deleted successfully", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
  setSubCategoryActiveStatus,
}