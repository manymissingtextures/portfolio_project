import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

contactSchema.pre('save', function handleUpdatedDate(next) {
  this.updated = Date.now();
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
