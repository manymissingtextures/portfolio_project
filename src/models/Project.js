const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) =>
          !value ||
          /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(value),
        message: 'Enter a GitHub repository URL.',
      },
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

module.exports = mongoose.model('Project', projectSchema);
