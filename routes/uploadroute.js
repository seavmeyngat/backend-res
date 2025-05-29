const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); 
const cloudinary = require('../utils/cloudinary');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'uploads' },
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ url: result.secure_url, public_id: result.public_id });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;


