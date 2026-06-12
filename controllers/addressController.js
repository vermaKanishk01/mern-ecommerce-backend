const Address = require("../models/addressModel");

// ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Required fields validation
    if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim()) {
      return res.status(400).json({ success: false, message: "Full name, phone, address and city are required", });
    }

    // Check duplicate address
    const existingAddress = await Address.findOne({
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state?.trim(),
    });

    if (existingAddress) {
      return res.status(409).json({ success: false, message: "This address already exists", });
    }

    const address = await Address.create({
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state?.trim(),
      postalCode: postalCode?.trim(),
      country: country?.trim() || "India",
      isDefault: isDefault || false,
    });

    return res.status(201).json({ success: true, message: "Address added successfully", data: address, });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};


// GET USER ADDRESSES
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: addresses, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found", });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized", });
    }

    Object.assign(address, req.body);

    await address.save();

    res.status(200).json({ success: true, message: "Address updated", data: address, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found", });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized", });
    }

    await address.deleteOne();

    res.status(200).json({ success: true, message: "Address deleted", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// SET DEFAULT ADDRESS
const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found", });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized", });
    }

    address.isDefault = true;
    await address.save();

    res.status(200).json({ success: true, message: "Default address updated", data: address, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}