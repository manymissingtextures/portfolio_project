const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    completion: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Qualification', qualificationSchema);
