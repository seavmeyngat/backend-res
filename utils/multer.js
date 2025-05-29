// utils/multer.js
const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory buffer
const upload = multer({ storage });

module.exports = upload;
