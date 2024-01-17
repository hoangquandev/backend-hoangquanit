const Course = require('../models/Course');

// Tạo mới khóa học
const createCourse = async (req, res) => {
    try {
        const { title, description, price, link } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            link,
        });

        const savedCourse = await newCourse.save();

        sendResponse(res, 201, 'Tạo mới khóa học thành công.', { course: savedCourse });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi tạo mới khóa học: ${error.message}`);
    }
};

// Lấy danh sách khóa học
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, 'title price');

        sendResponse(res, 200, 'Danh sách khóa học', { courses });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy danh sách khóa học: ${error.message}`);
    }
};

// Lấy chi tiết khóa học
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            sendResponse(res, 404, 'Không tìm thấy khóa học.');
        } else {
            // Kiểm tra nếu người dùng là admin, hiển thị link, ngược lại ẩn link
            if (req.user.role === 'admin') {
                sendResponse(res, 200, 'Lấy chi tiết khóa học thành công.', { course });
            } else {
                // Ẩn link khi trả về chi tiết cho người dùng thông thường
                const courseWithoutLink = { ...course.toObject(), link: undefined };
                sendResponse(res, 200, 'Lấy chi tiết khóa học thành công.', { course: courseWithoutLink });
            }
        }
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi lấy chi tiết khóa học: ${error.message}`);
    }
};


// Cập nhật khóa học
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, price, link } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { title, description, price, link },
            { new: true } // Trả về thông tin sau khi cập nhật
        );

        if (!updatedCourse) {
            return sendResponse(res, 404, 'Không tìm thấy khóa học.');
        }

        sendResponse(res, 200, 'Cập nhật khóa học thành công.', { course: updatedCourse });
    } catch (error) {
        sendResponse(res, 500, `Lỗi khi cập nhật khóa học: ${error.message}`);
    }
};

module.exports = { createCourse, getCourses, getCourseDetails, updateCourse };
