const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['pending', 'success', 'cancel'], default: 'pending' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
