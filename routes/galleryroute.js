const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallerycontroller');
const authenticate = require('../middleware/authmiddleware'); // your auth middleware

// Public route: get only published galleries
router.get('/published', galleryController.getPublishedGalleries);

// Admin routes (require authentication)
router.get('/getAll', galleryController.getAllGalleries);
router.post('/create', authenticate, galleryController.createGallery);
router.put('/update/:id', authenticate, galleryController.updateGallery);
router.delete('/deleteBy/:id', authenticate, galleryController.deleteGallery);

module.exports = router;
