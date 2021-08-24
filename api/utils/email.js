const nodemailer = require("nodemailer");

//1) Create a transporter
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    //2) Define the mail options

    const mailOptions = {
      from: "PmWare team,",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html ,
    };
    //3) Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
