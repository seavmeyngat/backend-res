const Gallery = require('../models/gallerymodel');
const cloudinary = require('../utils/cloudinary');

// CREATE
exports.createGallery = async (req, res) => {
  try {
    const {
      title,
      description,
      status = 'Draft',
      alt_text,
      tags,
      order,
      published_at,
    } = req.body;

    let image_url = req.body.image_url;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'galleries',
        resource_type: 'image',
      });
      image_url = result.secure_url;
    }

    if (!image_url || !title) {
      return res.status(400).json({ message: 'Image URL and title are required' });
    }

    const newGallery = await Gallery.create({
      image_url,
      title,
      description,
      status,
      alt_text,
      tags,
      order,
      published_at,
      uploaded_by: req.user?.id || null,
    });

    res.status(201).json(newGallery);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Server error creating gallery item' });
  }
};

// READ ALL
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ message: 'Failed to fetch gallery items' });
  }
};

// READ ONE
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.status(200).json(gallery);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Failed to fetch gallery item' });
  }
};

// UPDATE
exports.updateGallery = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      alt_text,
      tags,
      order,
    } = req.body;

    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    let image_url = req.body.image_url || gallery.image_url;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'galleries',
        resource_type: 'image',
      });
      image_url = result.secure_url;
    }

    // Set published_at based on status
    let published_at = gallery.published_at;
    if (status === 'Publish' && !gallery.published_at) {
      published_at = new Date();
    } else if (status === 'Draft') {
      published_at = null;
    }

    await gallery.update({
      image_url,
      title: title || gallery.title,
      description,
      status,
      alt_text,
      tags,
      order,
      published_at,
    });

    res.status(200).json(gallery);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Failed to update gallery item' });
  }
};


// DELETE (soft delete if paranoid enabled)
exports.deleteGallery = async (req, res) => {
  try {
    const deleted = await Gallery.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Failed to delete gallery item' });
  }
};

// GET all published galleries only
exports.getPublishedGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      where: { status: 'Publish' },
      order: [['order', 'ASC']], // optional: order by your display order
    });
    res.status(200).json(galleries);
  } catch (error) {
    console.error('Error fetching published galleries:', error);
    res.status(500).json({ message: 'Failed to fetch published galleries' });
  }
};
