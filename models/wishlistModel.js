const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one wishlist per user
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
}, { timestamps: true, });


// Prevent duplicate products
wishlistSchema.pre("save", function (next) {
  this.products = [...new Set(this.products.map(p => p.toString()))];
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;