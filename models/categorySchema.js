/**
 * Category Schema for Apex E-commerce
 * Defines categories for organizing products
 */
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
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

/**
 * Pre-save middleware to update the updatedAt timestamp
 */
categorySchema.pre("save", function (next) {
  // Update the updatedAt field with the current timestamp
  this.updatedAt = Date.now();
  next();
});

/**
 * Create indexes for better query performance
 */
// name field is already indexed by the unique constraint
categorySchema.index({ isListed: 1 });

// Create the model from the schema and export it
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
