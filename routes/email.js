const express = require('express');
const router = express.Router();
const transporter = require('../utils/senderemail'); // Adjust path accordingly

router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.SMTP_USER}>`, // sender address from env
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: 'Email sent', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
