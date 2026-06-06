const express = require("express");
const { getSubCategories, getSubCategoriesByCategory, createSubCategory, updateSubCategory, deleteSubCategory, setSubCategoryActiveStatus } = require("../controllers/subCategoryController");
const { protect, restrictTo } = require("../middleware/protect");

const subCategoryRouter = express.Router();

// PUBLIC ROUTES
subCategoryRouter.get("/", getSubCategories);
subCategoryRouter.get("/category/:categoryId", getSubCategoriesByCategory);

// ADMIN ROUTES
subCategoryRouter.post("/", protect, restrictTo("admin"), createSubCategory);
subCategoryRouter.put("/:id", protect, restrictTo("admin"), updateSubCategory);
subCategoryRouter.delete("/:id", protect, restrictTo("admin"), deleteSubCategory);
subCategoryRouter.patch("/:id", protect, restrictTo("admin"), setSubCategoryActiveStatus);


module.exports = subCategoryRouter;