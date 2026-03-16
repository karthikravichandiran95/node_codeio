const nodemailer = require("nodemailer");

// Transporter — Gmail SMTP vazhiyaa email anuppum
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// sendEmail — reusable function, enga vendumanalum call pannalaam
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Node CodeIO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
