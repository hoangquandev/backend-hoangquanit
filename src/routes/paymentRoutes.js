

/**
 * @swagger
 * definitions:
 *   Payment:
 *     type: object
 *     properties:
 *       userId:
 *         type: string
 *       name:
 *         type: string
 *       amount:
 *         type: number
 *       dueDate:
 *         type: string
 *       paid:
 *         type: boolean
 *       notificationSent:
 *         type: boolean
 */

const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Tạo thanh toán mới cho người dùng
/**
 * @swagger
 * payment/user-payments:
 *   post:
 *     summary: Tạo thanh toán mới cho người dùng
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - name
 *               - amount
 *               - dueDate
 *     responses:
 *       '201':
 *         description: Thanh toán được tạo thành công
 *       '401':
 *         description: Không được phép truy cập, token không hợp lệ
 *       '500':
 *         description: Lỗi server
 */
router.post('/user-payments', authMiddleware.authenticateToken, paymentController.createPaymentForUser);

// Lấy danh sách thanh toán của người dùng
/**
 * @swagger
 * payment/user-payments:
 *   get:
 *     summary: Lấy danh sách thanh toán của người dùng
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Danh sách thanh toán của người dùng
 *       '401':
 *         description: Không được phép truy cập, token không hợp lệ
 *       '500':
 *         description: Lỗi server
 */
router.get('/user-payments', authMiddleware.authenticateToken, paymentController.getPaymentsByUser);

// Lấy chi tiết thanh toán cho người dùng
/**
 * @swagger
 * payment/user-payments/{paymentId}:
 *   get:
 *     summary: Lấy chi tiết thanh toán cho người dùng
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thanh toán
 *     responses:
 *       '200':
 *         description: Chi tiết thanh toán cho người dùng
 *       '401':
 *         description: Không được phép truy cập, token không hợp lệ
 *       '404':
 *         description: Thanh toán không tồn tại hoặc bạn không có quyền truy cập nó
 *       '500':
 *         description: Lỗi server
 */
router.get('/user-payments/:paymentId', authMiddleware.authenticateToken, paymentController.getPaymentDetailsForUser);

// Cập nhật thanh toán cho người dùng
/**
 * @swagger
 * payment/user-payments/{paymentId}:
 *   put:
 *     summary: Cập nhật thanh toán cho người dùng
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thanh toán
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - name
 *               - amount
 *               - dueDate
 *     responses:
 *       '200':
 *         description: Thanh toán được cập nhật thành công
 *       '401':
 *         description: Không được phép truy cập, token không hợp lệ
 *       '404':
 *         description: Thanh toán không tồn tại hoặc bạn không có quyền cập nhật nó
 *       '500':
 *         description: Lỗi server
 */
router.put('/user-payments/:paymentId', authMiddleware.authenticateToken, paymentController.updatePaymentForUser);

// Xóa thanh toán cho người dùng
/**
 * @swagger
 * payment/user-payments/{paymentId}:
 *   delete:
 *     summary: Xóa thanh toán cho người dùng
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thanh toán
 *     responses:
 *       '200':
 *         description: Thanh toán được xóa thành công
 *       '401':
 *         description: Không được phép truy cập, token không hợp lệ
 *       '404':
 *         description: Thanh toán không tồn tại hoặc bạn không có quyền xóa nó
 *       '500':
 *         description: Lỗi server
 */
router.delete('/user-payments/:paymentId', authMiddleware.authenticateToken, paymentController.deletePaymentForUser);

module.exports = router;
