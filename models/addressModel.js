const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
  },

  addressLine: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
  },

  postalCode: {
    type: String,
  },

  country: {
    type: String,
    default: "India",
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, });

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("Address").updateMany(
      { user: this.user },
      { isDefault: false }
    );
  }
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;