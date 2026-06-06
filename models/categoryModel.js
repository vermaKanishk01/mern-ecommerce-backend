const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    maxlength: [50, "Category name cannot exceed 50 characters"],
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },

  description: {
    type: String,
    trim: true,
    maxlength: [300, "Description too long"],
  },

  image: {
    type: String, // URL (Cloudinary)
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
},{ timestamps: true, });

// Generate slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;