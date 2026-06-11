const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
    trim: true,
  },
}, { timestamps: true, });


// One user can review product only once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });


// Update product rating after save
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Product").findByIdAndUpdate(productId, {
    ratingsAverage: stats.length ? stats[0].avgRating : 0,
    ratingsCount: stats.length ? stats[0].totalReviews : 0,
  });
};


// After save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});


// After remove
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;