import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.emailSender,
      pass: process.env.emailpassword,
    },
  });

  const info = await transporter.sendMail({
    from: `"Ghazal7😎" <${process.env.emailSender}>`,
    to: to ? to : "",
    subject: subject ? subject : "hi👋",
    html: html ? html : "🖤",
    attachments,
  });

  if (info.accepted.length) {
    return true;
  }
  return false;
};
