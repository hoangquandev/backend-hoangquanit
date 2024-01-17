const sendResponse = require("../middlewares/responseMiddleware");
const Course = require("../models/Course");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // Kiểm tra xem người dùng đã mua khóa học này chưa
        const existingOrder = await Order.findOne({ userId, courseId });

        if (existingOrder) {
            sendResponse(res, 400, 'Bạn đã đặt đơn hàng này trước đó.');
        } else {
            // Tạo đơn hàng mới với trạng thái pending
            const order = await Order.create({ userId, courseId });

            // Lấy chi tiết khóa học để hiển thị trong đơn hàng đã mua
            const course = await Course.findById(courseId);

            sendResponse(res, 201, 'Tạo đơn hàng thành công.', { order, course });
        }
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi tạo đơn hàng: ${error.message}`);
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return sendResponse(res, 403, 'Bạn không có quyền thực hiện thao tác này');
        }

        // Cập nhật trạng thái của đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        sendResponse(res, 200, 'Cập nhật trạng thái đơn hàng thành công', { order: updatedOrder });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Lấy thông tin đơn hàng
        const order = await Order.findById(orderId);

        // Kiểm tra quyền hủy đơn hàng
        if (req.user._id.toString() !== order.userId.toString()) {
            return sendResponse(res, 403, 'Bạn không có quyền hủy đơn hàng này');
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'pending') {
            return sendResponse(res, 400, 'Không thể hủy đơn hàng với trạng thái hiện tại');
        }

        // Hủy đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'cancel' }, { new: true });

        sendResponse(res, 200, 'Hủy đơn hàng thành công', { order: updatedOrder });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi hủy đơn hàng: ${error.message}`);
    }
};
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        // Lấy danh sách đơn hàng của user
        const userOrders = await Order.find({ userId }).populate('courseId');

        sendResponse(res, 200, 'Lấy danh sách đơn hàng thành công', { orders: userOrders });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy danh sách đơn hàng: ${error.message}`);
    }
};
const getOrderDetailsForUser = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user._id;

        // Lấy chi tiết đơn hàng của user
        const userOrder = await Order.findOne({ _id: orderId, userId }).populate('courseId');

        if (!userOrder) {
            return sendResponse(res, 404, 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập');
        }

        // Kiểm tra nếu đơn hàng có status là success thì hiển thị link
        if (userOrder.status === 'success') {
            sendResponse(res, 200, 'Lấy chi tiết đơn hàng thành công', { order: { ...userOrder._doc, link: userOrder.courseId.link } });
        } else {
            sendResponse(res, 200, 'Lấy chi tiết đơn hàng thành công', { order: userOrder });
        }
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy chi tiết đơn hàng: ${error.message}`);
    }
};
module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrders,
    cancelOrder,
    getOrderDetailsForUser
}