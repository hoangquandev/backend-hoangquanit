// paymentScheduler.js

const cron = require('node-cron');
const Payment = require('../models/Payment');
const mailer = require('../utils/mailer');

// Mỗi ngày lúc 0:00, kiểm tra và thanh toán nếu cần
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const paymentsToProcess = await Payment.find({
            dueDate: { $lte: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000) }, // 5 ngày trước hạn
            paid: false,
            notificationSent: false, // Chưa gửi thông báo
        });

        for (const payment of paymentsToProcess) {
            // Gửi email thông báo
            await sendNotificationEmail(payment);

            // Cập nhật trạng thái thanh toán và đánh dấu đã gửi thông báo
            payment.paid = true;
            payment.notificationSent = true;
            await payment.save();
        }

        console.log('Automatic payments processed successfully.');
    } catch (error) {
        console.error('Error processing automatic payments:', error);
    }
});

// Hàm gửi email thông báo
const sendNotificationEmail = async (payment) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'recipient-email@example.com', // Thay thế bằng địa chỉ email của người nhận
            subject: 'Thông Báo Thanh Toán Trước Hạn',
            text: `Chào bạn,\nThanh toán của bạn cần được thực hiện trước ngày ${payment.dueDate.toISOString().slice(0, 10)}.\nCảm ơn!`,
        };

        // Gửi email sử dụng module mailer
        await mailer.sendMail(mailOptions);

        console.log(`Notification email sent successfully for payment with ID ${payment._id}`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};
