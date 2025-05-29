const WeeklyMenu = require('../models/weeklyMenuModel');
const { Op } = require('sequelize');

// Create a new weekly menu
exports.createWeeklyMenu = async (req, res) => {
  try {
    const {
      menu_shift,
      from_date,
      to_date,
      english_menu_description,
      khmer_menu_description,
      images_urls,
    } = req.body;

    if (!menu_shift || !from_date || !to_date || !english_menu_description || !khmer_menu_description) {
      return res.status(400).json({
        message: 'menu_shift, from_date, to_date, english_menu_description, and khmer_menu_description are required.',
      });
    }

    const newMenu = await WeeklyMenu.create({
      menu_shift,
      from_date,
      to_date,
      english_menu_description,
      khmer_menu_description,
      images_urls: Array.isArray(images_urls) ? images_urls.join(',') : images_urls,
    });

    res.status(201).json(newMenu);
  } catch (error) {
    console.error('Error creating weekly menu:', error);
    res.status(500).json({ message: 'Server error creating weekly menu' });
  }
};

// Get all weekly menus or filter by type (if needed)
exports.getWeeklyMenus = async (req, res) => {
  try {
    const { type } = req.query;

    let menus;
    if (type && type !== 'all') {
      menus = await WeeklyMenu.findAll({ where: { type } });
    } else {
      menus = await WeeklyMenu.findAll();
    }

    const formattedMenus = menus.map(menu => ({
      ...menu.toJSON(),
      images_urls: menu.images_urls ? menu.images_urls.split(',') : [],
    }));

    res.json(formattedMenus);
  } catch (error) {
    console.error('Error fetching weekly menus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single weekly menu by ID
exports.getWeeklyMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await WeeklyMenu.findByPk(id);

    if (!menu) {
      return res.status(404).json({ error: 'Weekly menu not found' });
    }

    res.json({
      ...menu.toJSON(),
      images_urls: menu.images_urls ? menu.images_urls.split(',') : [],
    });
  } catch (error) {
    console.error('Error fetching weekly menu by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a weekly menu
exports.updateWeeklyMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menu_shift,
      from_date,
      to_date,
      english_menu_description,
      khmer_menu_description,
      images_urls,
    } = req.body;

    const menu = await WeeklyMenu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Weekly menu not found' });
    }

    await menu.update({
      menu_shift,
      from_date,
      to_date,
      english_menu_description,
      khmer_menu_description,
      images_urls: Array.isArray(images_urls) ? images_urls.join(',') : images_urls,
    });

    res.json({
      ...menu.toJSON(),
      images_urls: menu.images_urls ? menu.images_urls.split(',') : [],
    });
  } catch (error) {
    console.error('Error updating weekly menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a weekly menu
exports.deleteWeeklyMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await WeeklyMenu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Weekly menu not found' });
    }

    await menu.destroy();
    res.json({ message: 'Weekly menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting weekly menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get menus by a date range or fallback to today
exports.getMenusByDateRangeOrToday = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Query parameters "from" and "to" are required.' });
    }

    const menus = await WeeklyMenu.findAll({
      where: {
        from_date: { [Op.lte]: to },
        to_date: { [Op.gte]: from },
      },
      order: [['from_date', 'ASC']],
    });

    if (menus.length > 0) {
      return res.json(
        menus.map(menu => ({
          ...menu.toJSON(),
          images_urls: menu.images_urls ? menu.images_urls.split(',') : [],
        }))
      );
    }

    // Fallback: show today's menus if none found
    const today = new Date().toISOString().split('T')[0];

    const fallbackMenus = await WeeklyMenu.findAll({
      where: {
        from_date: { [Op.lte]: today },
        to_date: { [Op.gte]: today },
      },
      order: [['from_date', 'ASC']],
    });

    res.json(
      fallbackMenus.map(menu => ({
        ...menu.toJSON(),
        images_urls: menu.images_urls ? menu.images_urls.split(',') : [],
      }))
    );
  } catch (error) {
    console.error('Error fetching weekly menus by date range:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
