const express = require('express');
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

// Tạo đơn hàng mới
router.post('/orders', authMiddleware.authenticateToken, orderController.createOrder);

// Cập nhật trạng thái của đơn hàng bởi admin
router.put('/orders/:orderId/status', authMiddleware.authenticateToken(['admin']), orderController.updateOrderStatus);

// Hủy đơn hàng bởi student
router.put('/orders/:orderId/cancel', authMiddleware.authenticateToken(['student']), orderController.cancelOrder);

// Lấy danh sách đơn hàng của user
router.get('/user-orders', authMiddleware.authenticateToken, orderController.getUserOrders);

// Lấy chi tiết đơn hàng của user
router.get('/user-orders/:orderId', authMiddleware.authenticateToken(['student']), orderController.getOrderDetailsForUser);

module.exports = router;
