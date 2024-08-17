const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '../'); // Adjust this path if your middleware folder is at a different level

// Define the path for the uploads directory
const uploadsDir = path.join(rootDir, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
