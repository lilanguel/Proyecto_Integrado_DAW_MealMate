// Nodemailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  port: 465,
  secure: true, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify().then(() => {
  console.log("Ready to send emails");
});

module.exports = {
  transporter
};