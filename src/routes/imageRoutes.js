
const express = require('express');
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/images', authMiddleware.authenticateToken(['admin']), imageController.listImagesForAdmin);

module.exports = router;
