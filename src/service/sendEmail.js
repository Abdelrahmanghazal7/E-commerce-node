import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdelrahmanghazal7@gmail.com",
      pass: "yctapahfketvaafb",
    },
  });

  const info = await transporter.sendMail({
    from: '"Ghazal7😎" <abdelrahmanghazal7@gmail.com>',
    to: to ? to : "",
    subject: subject ? subject : "hi👋",
    html: html ? html : "🖤",
    attachments
  });

  if (info.accepted.length) {
    return true;
  }
  return false;
};
