import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send password reset email
 * @param {string} to - recipient email
 * @param {string} name - customer name
 * @param {string} resetUrl - link to reset page
 */
export async function sendPasswordResetEmail(to, name, resetUrl) {
  const mailOptions = {
    from: `"Healthcare Queue" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>Hello ${name || ""},</p>
      <p>You requested a password reset for your Healthcare Queue account.</p>
      <p>Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(` Password reset email sent to ${to}`);
}

/**
 * Send next-in-line notification
 * @param {string} to - recipient email
 * @param {object} context - info to personalize message
 * @param {string} context.queueName
 * @param {string} context.currentTicketId
 */
export async function sendNextUpEmail(to, { queueName, currentTicketId }) {
  const mailOptions = {
    from: `"Healthcare Queue" <${process.env.GMAIL_USER}>`,
    to,
    subject: "You're next in line",
    html: `
      <p>Hello,</p>
      <p>You're next in line for <strong>${queueName || "the queue"}</strong>.</p>
      <p>Current ticket being served: <strong>${currentTicketId}</strong>.</p>
      <p>Please proceed to the service area. If you cannot make it, reply to this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(` Next-up email sent to ${to}`);
}
