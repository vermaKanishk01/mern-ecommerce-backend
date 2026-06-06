const express = require("express");
const { getCategories, getCategory, createCategory, updateCategory, setCategoryActiveStatus } = require("../controllers/categoryController");
const { restrictTo, protect } = require("../middleware/protect");

const categoryRouter = express.Router();

// Public Routes
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

// Admin Routes
categoryRouter.post("/", protect, restrictTo("admin"), createCategory);
categoryRouter.put("/:id", protect, restrictTo("admin"), updateCategory);
categoryRouter.patch("/:id", protect, restrictTo("admin"), setCategoryActiveStatus);


module.exports = categoryRouter;