import mongoose from 'mongoose';
import slugify from 'slugify';

export const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Category name is required' ],
    unique: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },

  description: {
    type: String,
    trim: true
  },

  image: {
    type: String
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  }
}, { timestamps: true });

// to auto generate slug from name before saving in DB, if name is new
categorySchema.pre('save', function () {
  if (this.isModified('name')) 
  this.slug = slugify(this.name, { lower: true, strict: true });
});
const Category = mongoose.model('Category', categorySchema);

export default Category;


