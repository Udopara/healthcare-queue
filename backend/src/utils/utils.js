import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn("WARNING: GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables!");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

setTimeout(() => {
  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter verification failed:", error.message);
    } else {
      console.log("Email transporter is ready to send messages");
    }
  });
}, 1000);

//  Creates a JWT token for authentication, expires in 7 days by default
export const createAuthToken = (payload, options = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
    ...options,
  });

// Sends a password reset email to the user with a reset link
export async function sendPasswordResetEmail(to, name, resetUrl) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Email configuration is missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file");
  }

  if (!to || !resetUrl) {
    throw new Error("Missing required email parameters: to or resetUrl");
  }

  const mailOptions = {
    from: `"Healthcare Queue" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>Hello ${name || "there"},</p>
      <p>You requested a password reset for your Healthcare Queue account.</p>
      <p>Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `
      Hello ${name || "there"},

      You requested a password reset for your Healthcare Queue account.

      Please visit the following link to reset your password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request this, please ignore this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully to ${to}`);
    console.log(`   Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    console.error("   Error details:", {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
    });
    throw error;
  }
}

// Notifies the next person in queue that it's their turn
export async function sendNextUpEmail(to, { queueName, currentTicketId }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email configuration missing. Cannot send next-up notification.");
    return;
  }

  if (!to) {
    console.warn("No email address provided for next-up notification.");
    return;
  }

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
    text: `
      Hello,

      You're next in line for ${queueName || "the queue"}.

      Current ticket being served: ${currentTicketId}

      Please proceed to the service area. If you cannot make it, reply to this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Next-up email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error("Failed to send next-up email:", error);
    console.error("   Error details:", {
      message: error.message,
      code: error.code,
    });
    throw error;
  }
}