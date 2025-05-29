const Item = require('../models/itemsmodel');
const cloudinary = require('../utils/cloudinary'); // if you want to upload image to Cloudinary, for example

exports.createItem = async (req, res) => {
  try {
    const { name, type, price, discount, description ,image_url} = req.body;

    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Name, type, and price are required.' });
    }

    // let image_url = null;

    if (req.file) {
      // Example: Upload the file buffer to Cloudinary (or another service)
      const uploadedResponse = await cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            throw new Error('Cloudinary upload failed');
          }
          return result;
        }
      );

      // If using async/await with upload_stream, wrap in Promise or use upload() instead.
      // Or just use cloudinary.uploader.upload() with req.file.buffer if supported.

      // For demo, let's assume you saved locally or have a URL:
      // image_url = 'some URL/path';

      // If you want to save locally, you need to write req.file.buffer to a file first.
    }

    const newItem = await Item.create({
      name,
      type,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      description: description || '',
      image_url,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error creating item' });
  }
};


// Get all items or filter by type
exports.getItems = async (req, res) => {
  try {
    const { type } = req.query;
    const items = type
      ? await Item.findAll({ where: { type } })
      : await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, description, discount } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.update({
      name,
      type,
      price,
      description,
      discount,
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
