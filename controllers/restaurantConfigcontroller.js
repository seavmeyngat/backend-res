const RestaurantConfig = require('../models/restaurantConfigmodel');

// Create new restaurant config
exports.createRestaurantConfig = async (req, res) => {
  try {
    const {
      restaurant_name,
      restaurant_logo_url,
      breakfast_from_time,
      breakfast_to_time,
      lunch_from_time,
      lunch_to_time,
      location,
      contact_phone_1,
      contact_email_1,
      opening_description,
      footer
    } = req.body;
    if (!restaurant_name) {
      return res.status(400).json({ message: 'Restaurant name is required.' });
    }

    const newConfig = await RestaurantConfig.create({
      restaurant_name,
      restaurant_logo_url,
      breakfast_from_time,
      breakfast_to_time,
      lunch_from_time,
      lunch_to_time,
      location,
      contact_phone_1,
      contact_email_1,
      opening_description,
      footer
    });
console.log('Config saved:', newConfig);
    res.status(201).json(newConfig);

  } catch (error) {
    console.error('Error creating config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all configs
exports.getAllRestaurantConfigs = async (req, res) => {
  try {
    const configs = await RestaurantConfig.findAll();
    res.json(configs);
  } catch (error) {
    console.error('Error fetching configs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get one config by ID
exports.getRestaurantConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await RestaurantConfig.findByPk(id);

    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update config
exports.updateRestaurantConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await RestaurantConfig.findByPk(id);
    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    await config.update(req.body);

    res.json(config);
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete config
exports.deleteRestaurantConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await RestaurantConfig.findByPk(id);
    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    await config.destroy();
    res.json({ message: 'Config deleted successfully' });
  } catch (error) {
    console.error('Error deleting config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
