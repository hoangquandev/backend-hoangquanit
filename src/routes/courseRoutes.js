const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Tạo mới khóa học (yêu cầu quyền admin)
router.post('/courses', authMiddleware.authenticateToken(['admin']), courseController.createCourse);

// Lấy danh sách khóa học
router.get('/courses', courseController.getCourses);

// Lấy chi tiết khóa học
router.get('/courses/:courseId', courseController.getCourseDetails);

// Cập nhật thông tin khóa học (yêu cầu quyền admin)
router.put('/courses/:courseId', authMiddleware.authenticateToken(['admin']), courseController.updateCourse);

module.exports = router;
