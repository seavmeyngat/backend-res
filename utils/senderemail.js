const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false for STARTTLS (port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // temporarily allow self-signed certs
  }
});



const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Lotus Blanc Training Restaurant & bakery" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject,
      html,
    });
  } catch (err) {
    console.error('Failed to send status update email:', err.message);
  }
};

module.exports = sendMail;
