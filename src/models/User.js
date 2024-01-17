const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    role: { type: String, enum: ['admin', 'customer', 'student'], default: 'student' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

// Thêm middleware trước khi lưu để hash mật khẩu
userSchema.pre('save', async function (next) {
    try {
        // Chỉ hash mật khẩu nếu nó mới được thay đổi hoặc tài khoản mới được tạo
        if (!this.isModified('password')) {
            return next();
        }

        // Sử dụng bcrypt để hash mật khẩu
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
