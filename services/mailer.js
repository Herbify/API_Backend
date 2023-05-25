const nodemailer = require("nodemailer");
const prisma = require("../prisma");

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

async function sendEmailOTP(email) {
  try {
    const code = Math.floor(1000 + Math.random() * 9000);
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    const currentDate = new Date();
    const oneHourLater = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
    const data = await prisma.otp.create({
      data: {
        code,
        userId: user.id,
        expiredAt: oneHourLater,
      },
    });

    const mailOptions = {
      from: "indo.herbify@gmail.com",
      to: email,
      subject: "Your One Time Password (OTP)",
      html: `<h2>Dear ${user.name},</h2>
      <p>We are pleased to provide you with the requested One-Time Password (OTP) for accessing your account. Please find the details below:</p>
      <h2>OTP: ${code}</h2>
      <p>
        This OTP is valid for a single use only and will expire within 1 hour. Please ensure that you enter the OTP within the given time frame.<br>
        If you did not request this OTP or believe it was sent to you in error, please disregard this email.<br>
        For any further assistance or inquiries, please feel free to reach out to our support team at <b>indo.herbify@gmail.com</b>.
      </p>
      <p style="font-size: 16px;">
        Best regards,<br>
        <b>Herbify Team.</b>
      </p>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return {
      info: info.response,
      data,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

module.exports = sendEmailOTP;
