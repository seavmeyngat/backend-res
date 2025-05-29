const OpeningHour = require('../models/openingmodel');

exports.createOpening = async (req, res) => {
  try {
    const { day_of_week, open_time, close_time, description } = req.body;
    const uploaded_by = req.user?.id;

    if (!uploaded_by) {
      return res.status(401).json({ error: 'Unauthorized: admin ID missing' });
    }

    const newOpeningHour = await OpeningHour.create({
      uploaded_by,
      day_of_week,
      open_time,
      close_time,
      description
    });

    res.status(201).json({
      message: 'Opening hour created',
      opening_id: newOpeningHour.opening_id,
      uploaded_by: newOpeningHour.uploaded_by,
      data: newOpeningHour
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOpening = async (req, res) => {
  try {
    const openingHours = await OpeningHour.findAll();
    res.status(200).json(openingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOpeningById = async (req, res) => {
  try {
    const { id } = req.params;
    const openingHour = await OpeningHour.findOne({ where: { opening_id: id } });

    if (!openingHour) {
      return res.status(404).json({ error: 'Opening hour not found' });
    }

    res.status(200).json(openingHour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOpening = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, open_time, close_time, description } = req.body;

    const openingHour = await OpeningHour.findOne({ where: { opening_id: id } });
    if (!openingHour) {
      return res.status(404).json({ error: 'Opening hour not found' });
    }

    await openingHour.update({
      day_of_week,
      open_time,
      close_time,
      description
    });

    res.status(200).json({ message: 'Opening hour updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOpening = async (req, res) => {
  try {
    const { id } = req.params;

    const openingHour = await OpeningHour.findOne({ where: { opening_id: id } });
    if (!openingHour) {
      return res.status(404).json({ error: 'Opening hour not found' });
    }

    await openingHour.destroy();
    res.status(200).json({ message: 'Opening hour deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
