/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       phone:
 *         type: string
 *       image:
 *         type: string
 *       role:
 *         type: string
 *         enum: [admin, customer, student]
 */

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /user/profile/image:
 *     put:
 *       summary: Cập nhật hình ảnh người dùng
 *       description: Route này cho phép người dùng cập nhật hình ảnh cá nhân.
 *       security:
 *         - BearerAuth: []  # Sử dụng phương thức xác thực Bearer Token
 *       consumes:
 *         - multipart/form-data  # Sử dụng khi gửi dữ liệu dưới dạng form-data (đối với upload file)
 *       parameters:
 *         - in: formData
 *           name: image
 *           type: file
 *           required: true
 *           description: File hình ảnh mới để cập nhật cho người dùng.
 *       responses:
 *         '200':
 *           description: Thành công. Trả về thông tin người dùng đã được cập nhật.
 *           content:
 *             application/json:
 *               example:
 *                 message: 'Hình ảnh người dùng đã được cập nhật thành công.'
 *                 user:
 *                   id: userId
 *                   username: username
 *                   email: user@example.com
 *                   image: updatedImage.jpg
 *         '401':
 *           description: Unauthorized - Không có hoặc token không hợp lệ.
 *         '403':
 *           description: Forbidden - Không có quyền thực hiện hành động này.
 *         '404':
 *           description: Not Found - Người dùng không tồn tại.
 *         '415':
 *           description: Unsupported Media Type - Loại dữ liệu không được hỗ trợ.
 */
router.put('/profile/image', authMiddleware.authenticateToken, upload.single('image'), userController.updateUserImage);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Endpoint to login a user.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: credentials
 *         description: User credentials
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', userController.login);

router.post('/refresh', authMiddleware.verifyRefreshToken, userController.refreshToken);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Endpoint to initiate the password reset process.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset initiated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Endpoint to get the user's profile.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         schema:
 *           $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *       500:
 *         description: Internal Server Error
 */
router.get('/profile', authMiddleware.authenticateToken, userController.getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Endpoint to update the user's profile.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Updated user profile
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         schema:
 *           $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *       500:
 *         description: Internal Server Error
 */
router.put('/profile', authMiddleware.authenticateToken, userController.updateUserProfile);

/**
 * @swagger
 * /users/admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     description: Endpoint to get a list of all users (requires admin role).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.get('/admin/users', authMiddleware.authenticateToken(['admin']), userController.getUsers);

/**
 * @swagger
 * /users/admin/update-user-status:
 *   put:
 *     summary: Update user status (admin)
 *     description: Endpoint to update the status of a user (requires admin role).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: ID of the user to update
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             status:
 *               type: string
 *               enum: [active, blocked]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         schema:
 *           $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/admin/update-user-status', authMiddleware.authenticateToken(['admin']), userController.updateUserStatus);

module.exports = router;
