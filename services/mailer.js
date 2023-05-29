const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "indo.herbify@gmail.com",
    pass: "ndlqawosrfcgjqcj",
  },
});

async function emailConfirmation(email) {
  try {
    // Prepare email details
    const mailOptions = {
      from: "indo.herbify@gmail.com",
      to: email,
      subject: "Test Email",
      html: "<h1>Hello,</h1><p>This is a test email with <strong>HTML</strong> content.</p>",
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

module.exports = emailConfirmation;
