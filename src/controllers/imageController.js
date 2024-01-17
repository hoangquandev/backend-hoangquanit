const Image = require('../models/Image');
const fs = require('fs');

const listImagesForAdmin = async (req, res) => {
    try {
        // Lấy tất cả các bản ghi trong mô hình Image
        const images = await Image.find().populate('user_id', 'username email');

        // Kiểm tra và xóa hình ảnh không có người dùng liên kết
        await deleteUnlinkedImages(images);

        // Lấy lại danh sách hình ảnh sau khi xóa
        const updatedImages = await Image.find().populate('user_id', 'username email');

        // Trả về danh sách hình ảnh với thông tin người dùng liên kết
        const responseImages = updatedImages.map(image => {
            return {
                filename: image.filename,
                user: {
                    id: image.user_id._id,
                    username: image.user_id.username,
                    email: image.user_id.email,
                },
            };
        });

        return res.status(200).json({ images: responseImages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Hàm kiểm tra và xóa hình ảnh không có người dùng liên kết
const deleteUnlinkedImages = async (images) => {
    for (const image of images) {
        // Nếu không có người dùng liên kết, xóa hình ảnh
        if (!image.user_id) {
            const imagePath = `uploads/${image.filename}`;
            // Xóa hình ảnh từ thư mục và cơ sở dữ liệu
            await Image.findByIdAndDelete(image._id);
            fs.unlinkSync(imagePath);
        }
    }
};

module.exports = {
    listImagesForAdmin
}