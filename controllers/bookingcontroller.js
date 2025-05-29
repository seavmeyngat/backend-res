const Booking = require('../models/bookingmodel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper to send email (HTML version)
const sendStatusEmail = async (booking) => {
  let subject, html;

  if (booking.status === 'accepted') {
    subject = 'Booking Accepted - Your Restaurant';
    html = `
      <p>Dear ${booking.name},</p>
      <p>Your booking for <strong>${booking.date_to_come}</strong> at <strong>${booking.time_to_come}</strong> has been <strong>accepted</strong>.</p>
      <p>We look forward to seeing you!</p>
      <p>Thank you,<br/>Your Restaurant Team</p>
    `;
  } else if (booking.status === 'rejected') {
    subject = 'Booking Rejected - Your Restaurant';
    html = `
      <p>Dear ${booking.name},</p>
      <p>We regret to inform you that your booking for <strong>${booking.date_to_come}</strong> at <strong>${booking.time_to_come}</strong> has been <strong>rejected</strong>.</p>
      <p><strong>Reason:</strong> ${booking.rejection_reason || 'No reason provided'}</p>
      <p>Please contact us for more information.</p>
      <p>Thank you,<br/>Your Restaurant Team</p>
    `;
  } else {
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Your Restaurant" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject,
      html,
    });
  } catch (err) {
    console.error('Failed to send status update email:', err.message);
  }
};

const sendBookingSummaryEmail = async (booking) => {
  const subject = 'Booking Confirmation - Your Restaurant';
  const html = `
    <p>Dear ${booking.name},</p>
    <p>Thank you for your booking. Here are your booking details:</p>
    <ul>
      <li>Date: ${booking.date_to_come}</li>
      <li>Time: ${booking.time_to_come}</li>
      <li>Floor: ${booking.floor}</li>
      <li>Table: ${booking.table_type}</li>
      <li>Number of people: ${booking.number_of_people}</li>
    </ul>
    <p>We will notify you once your booking status is updated.</p>
    <p>Thank you,<br/>Your Restaurant Team</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Your Restaurant" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject,
      html,
    });
  } catch (err) {
    console.error('Failed to send booking summary email:', err.message);
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      number_of_people,
      floor,
      table_type,
      date_to_come,
      time_to_come,
      description
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: no user info' });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      number_of_people,
      floor,
      table_type,
      date_to_come,
      time_to_come,
      description,
      create_by: req.user.id,
      status: 'pending',
      rejection_reason: null
    });

    await sendBookingSummaryEmail(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      number_of_people,
      floor,
      table_type,
      date_to_come,
      time_to_come,
      description
    } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({
      name,
      email,
      phone,
      number_of_people,
      floor,
      table_type,
      date_to_come,
      time_to_come,
      description
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update booking status and send email
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    booking.rejection_reason = status === 'rejected' ? rejection_reason || 'No reason provided' : null;

    await booking.save();

    await sendStatusEmail(booking);

    res.json({ message: 'Booking status updated and email sent', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
