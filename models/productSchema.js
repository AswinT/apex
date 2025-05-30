/**
 * Product Schema for Apex E-commerce
 * Defines the structure for headphone products
 */
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  specifications: [
    {
      key: String,
      value: String,
    },
  ],
  features: [String],
  isListed: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update the updatedAt timestamp

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isListed: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ averageRating: -1 }); // for sorting by rating

// Create the model and export
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
