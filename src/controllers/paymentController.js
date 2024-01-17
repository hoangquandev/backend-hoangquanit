const Payment = require('../models/Payment');
const sendResponse = require('../middlewares/responseMiddleware');
const sendError = require('../middlewares/errorMiddleware');

// Tạo thanh toán mới cho người dùng
const createPaymentForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, amount, dueDate } = req.body;

        const newPayment = new Payment({
            userId,
            name,
            amount,
            dueDate,
        });

        await newPayment.save();

        sendResponse(res, 201, 'Tạo thanh toán thành công', newPayment);
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi tạo thanh toán: ${error.message}`);
    }
};

// Lấy danh sách thanh toán của người dùng
const getPaymentsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const payments = await Payment.find({ userId });

        sendResponse(res, 200, 'Lấy danh sách thanh toán thành công', payments);
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy danh sách thanh toán: ${error.message}`);
    }
};


// Lấy chi tiết thanh toán cho người dùng
const getPaymentDetailsForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentId } = req.params;

        const paymentDetails = await Payment.findOne({ _id: paymentId, userId });

        if (!paymentDetails) {
            return sendResponse(res, 404, 'Thanh toán không tồn tại hoặc bạn không có quyền truy cập nó.');
        }

        sendResponse(res, 200, 'Lấy chi tiết thanh toán thành công', paymentDetails);
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy chi tiết thanh toán: ${error.message}`);
    }
};



// Cập nhật thanh toán cho người dùng
const updatePaymentForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentId } = req.params;
        const newData = req.body;

        const updatedPayment = await Payment.findOneAndUpdate({ _id: paymentId, userId }, newData, { new: true });

        if (!updatedPayment) {
            return sendResponse(res, 404, 'Thanh toán không tồn tại hoặc bạn không có quyền cập nhật nó.');
        }

        sendResponse(res, 200, 'Cập nhật thanh toán thành công', updatedPayment);
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi cập nhật thanh toán: ${error.message}`);
    }
};

// Xóa thanh toán cho người dùng
const deletePaymentForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentId } = req.params;

        const deletedPayment = await Payment.findOneAndDelete({ _id: paymentId, userId });

        if (!deletedPayment) {
            return sendResponse(res, 404, 'Thanh toán không tồn tại hoặc bạn không có quyền xóa nó.');
        }

        sendResponse(res, 200, 'Xóa thanh toán thành công', deletedPayment);
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi xóa thanh toán: ${error.message}`);
    }
};
module.exports = {
    createPaymentForUser,
    getPaymentsByUser,
    updatePaymentForUser,
    getPaymentDetailsForUser,
    deletePaymentForUser
}
