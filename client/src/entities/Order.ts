import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'completed', 'canceled'],
    required: true,
    default: 'pending',
  },
  products: {
    type: Map,
    of: Number, // Количество каждого продукта
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userName: {
    type: String,
    required: true,
  },
  userNick: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;