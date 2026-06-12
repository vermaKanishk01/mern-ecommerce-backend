const express = require("express");
const { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress } = require("../controllers/addressController");
const { protect } = require("../middleware/protect");

const addressRouter = express.Router();

addressRouter.post("/", protect, addAddress);
addressRouter.get("/", protect, getAddresses);
addressRouter.put("/:id", protect, updateAddress);
addressRouter.delete("/:id", protect, deleteAddress);
addressRouter.put("/default/:id", protect, setDefaultAddress);

module.exports = addressRouter;