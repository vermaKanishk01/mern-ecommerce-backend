const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), // 👈 fix (important)
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `YourApp <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;