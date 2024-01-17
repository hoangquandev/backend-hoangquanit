const app = require('./src/app'); // Đường dẫn đến tệp app.js
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
