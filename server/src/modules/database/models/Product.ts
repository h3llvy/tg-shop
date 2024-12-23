import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  image: { type: String, required: true },
  price: { type: String, required: true },
  subtitle: { type: String, required: true },
  id: { type: Number, required: true, unique: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;