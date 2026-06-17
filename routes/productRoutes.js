const express = require("express");
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, toggleProductActiveStatus, } = require("../controllers/productController");
const { protect, restrictTo } = require("../middleware/protect");
const upload = require("../middleware/multer");

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getSingleProduct);

// ADMIN ROUTES
productRouter.post("/create", protect, restrictTo("admin"), upload.array("images", 5), createProduct);
productRouter.patch("/:id", protect, restrictTo("admin"), updateProduct);
productRouter.patch("/:id/toggle-status", protect, restrictTo("admin"), toggleProductActiveStatus);
productRouter.delete("/:id", protect, restrictTo("admin"), deleteProduct);

module.exports = productRouter;