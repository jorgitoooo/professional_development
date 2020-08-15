const nodemailer = require('nodemailer');

async function sendEmail(options) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    // Activate "less secure app" option in gmail
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'Jorge Garcia <jlg.sftdev@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
