const nodemailer = require('nodemailer');
require('dotenv').config(); // Đọc biến môi trường từ file .env

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Sử dụng biến môi trường
        pass: process.env.EMAIL_PASSWORD, // Sử dụng biến môi trường
    },
});

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

module.exports = { sendMail };
