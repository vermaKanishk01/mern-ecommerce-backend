const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subcategory name is required"],
    trim: true,
    maxlength: [50, "Name too long"],
  },

  slug: {
    type: String,
    lowercase: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Subcategory must belong to a category"],
    index: true,
  },

  categoryName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    trim: true,
    maxlength: [300, "Description too long"],
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, { timestamps: true });

// Prevent duplicate subcategory names under same category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Slug generation
subCategorySchema.pre("validate", async function (next) {
  // slug
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }

  // categoryName
  if (this.isModified("category")) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(this.category);

    if (category) {
      this.categoryName = category.name;
    }
  }

});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;