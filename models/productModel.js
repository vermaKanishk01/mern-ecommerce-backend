const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    unique: true,
    maxlength: [120, "Product name cannot exceed 120 characters"],
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    minlength: [20, "Description should be at least 20 characters"],
  },

  brand: {
    type: String,
    trim: true,
    maxlength: [50, "Brand name cannot exceed 50 characters"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product must belong to a category"],
  },

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },

  discountPrice: {
    type: Number,
    validate: {
      validator: function (value) {
        if (value == null) return true;
        return value < this.price;
      },
      message: "Discount price must be less than original price",
    },
  },

  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },

  sku: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },

  images: {
    type: [
      {
        url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    default: [],

    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one product image is required",
    },
  },

  sizes: [
    {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
  ],

  colors: [
    {
      type: String,
      trim: true,
    },
  ],

  material: {
    type: String,
    trim: true,
  },

  gender: {
    type: String,
    enum: ["Men", "Women", "Unisex"],
  },

  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be below 0"],
    max: [5, "Rating cannot exceed 5"],
  },

  ratingsCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true, });

// Performance indexes
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

// Product search index
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

// Generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

// Auto-generate SKU
productSchema.pre("save", function (next) {
  if (this.isNew && !this.sku) {
    this.sku = `PRD-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;