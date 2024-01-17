const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResponse = require('../middlewares/responseMiddleware');
const sendError = require('../middlewares/errorMiddleware');
const mailer = require('../utils/mailer');
const Image = require('../models/Image');


const generateTokens = (userId, role) => {
    const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30m',
    });

    const refreshToken = jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
};

// đăng kí
const registerUser = async (req, res) => {
    try {
        // Lấy dữ liệu từ yêu cầu đăng ký
        const { username, email, password, phone, image, role } = req.body;

        // Kiểm tra xem email đã được đăng ký chưa
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendError(res, 400, 'Email is already registered');
        }

        // Tạo người dùng mới
        const newUser = new User({
            username,
            email,
            password, // Cần hash mật khẩu trước khi lưu vào cơ sở dữ liệu
            phone,
            image,
            role: role || 'customer', // Nếu không có trường role trong yêu cầu, sử dụng giá trị mặc định 'customer'
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Kiểm tra nếu người đăng ký là admin, thực hiện gửi thông báo cho admin
        if (newUser.role === 'admin') {
            const admins = await User.find({ role: 'admin' });

            // Lấy danh sách email của tất cả người dùng có vai trò admin
            const adminEmails = admins.map(admin => admin.email);

            const subject = 'New Admin Registration';
            const message = `A new admin has registered:\n\nUsername: ${username}\nEmail: ${email}`;

            // Gửi thông báo cho tất cả admin
            for (const adminEmail of adminEmails) {
                await mailer.sendMail({
                    to: adminEmail,
                    subject,
                    text: message,
                });
            }
        }

        // Gửi phản hồi cho người dùng
        sendResponse(res, 201, 'User registered successfully', { user: newUser });
    } catch (error) {
        console.error('Error during user registration:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

// đăng nhập bằng username || email
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Tìm kiếm người dùng theo username hoặc email
        const user = await User.findOne({
            $or: [{ username: email }, { email: email }],
        });

        // Kiểm tra người dùng tồn tại và mật khẩu đúng
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return sendError(res, 401, 'Invalid username or email or password');
        }

        // Tạo AccessToken và RefreshToken
        const { accessToken, refreshToken } = generateTokens(user._id, user.role);

        // Gửi token trong phản hồi
        sendResponse(res, 200, 'Login successful', { accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

const refreshToken = (req, res) => {
    const user = req.user;

    if (!user) {
        return sendError(res, 403, 'Invalid user');
    }

    const { userId, role } = user;
    const { accessToken } = generateTokens(userId, role);

    sendResponse(res, 200, 'refresh token successfully', { accessToken });
};

// quên mật khẩu
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm kiếm người dùng theo email
        const user = await User.findOne({ email });

        // Nếu người dùng không tồn tại, trả về lỗi
        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        // Tạo token đặt lại mật khẩu và thời hạn hết hạn
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ

        // Lưu thông tin token vào cơ sở dữ liệu
        await user.save();

        // Gửi email với link đặt lại mật khẩu
        const resetUrl = `http://your-frontend-url/reset-password?token=${resetToken}`;
        const mailOptions = {
            to: user.email,
            subject: 'Reset Password',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
                + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
                + `${resetUrl}\n\n`
                + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await mailer.sendMail(mailOptions);

        sendResponse(res, 200, 'Password reset email sent');
    } catch (error) {
        console.error('Error during forgot password:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

// profile
const getUserProfile = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token xác thực
        const userId = req.user.userId;

        // Lấy thông tin người dùng chỉ bao gồm những trường mong muốn
        const user = await User.findById(userId).select('email username phone image');

        // Trả về thông tin người dùng
        sendResponse(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
        console.error('Error during get user profile:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

const updateUserProfile = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token xác thực
        const userId = req.user.userId;

        // Lấy dữ liệu cập nhật từ yêu cầu
        const { username, email, phone, image } = req.body;

        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, phone, image },
            { new: true } // Trả về người dùng đã được cập nhật
        ).select('email username phone image'); // Chỉ trả về những trường mong muốn

        // Trả về thông tin người dùng sau khi cập nhật
        sendResponse(res, 200, 'User profile updated successfully', { user: updatedUser });
    } catch (error) {
        console.error('Error during update user profile:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

// admin
const getUsers = async (req, res) => {
    try {
        // Lấy danh sách người dùng
        const users = await User.find();

        // Trả về danh sách người dùng
        sendResponse(res, 200, 'List of users retrieved successfully', { users });
    } catch (error) {
        console.error('Error during get users:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        // Cập nhật trạng thái của người dùng
        user.status = status;
        await user.save();

        // Trả về thông báo và thông tin người dùng sau khi cập nhật
        sendResponse(res, 200, `User status updated to ${status} successfully`, { user });
    } catch (error) {
        console.error('Error during update user status:', error);
        sendError(res, 500, 'Internal Server Error');
    }
};
const updateUserImage = async (req, res) => {
    try {
        const imagePath = req.file.path;

        // Cập nhật đường dẫn hình ảnh trong thông tin người dùng
        await User.findByIdAndUpdate(req.user._id, { image: imagePath });

        // Tạo một bản ghi mới trong mô hình Image để lưu thông tin liên kết
        await Image.create({ filename: imagePath, user_id: req.user._id });

        return res.status(200).json({ message: 'User image updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { registerUser, login, refreshToken, forgotPassword, getUserProfile, updateUserProfile, getUsers, updateUserStatus, updateUserImage };
