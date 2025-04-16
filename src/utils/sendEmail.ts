import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import { Notification, UserNotification } from "../models/team/emailModel";
interface NotificationData {
  username: string;
  receiverUsername: string;
  userId: string;
}

export async function sendEmail(
  user: { email: string },
  emailTemplateName: string,
  data: Record<string, any>
): Promise<void> {
  try {
    const templatePath = path.join(
      __dirname,
      "emailTemplates",
      `${emailTemplateName}.html`
    );

    if (!(await fs.stat(templatePath).catch(() => false))) {
      throw new Error(`Template file "${emailTemplateName}.html" not found`);
    }

    const templateContent = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders in the template
    const emailContent = Object.keys(data).reduce((content, key) => {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      return content.replace(placeholder, data[key]);
    }, templateContent);

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: "Your Subject Here",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", {
        message: error.message,
        stack: error.stack,
        user: user.email,
        template: emailTemplateName,
      });
    } else {
      console.error("Unknown error occurred:", error);
    }
    throw error;
  }
}

export const sendNotification = async (
  templateName: string,
  data: NotificationData
) => {
  const notificationTemp = await Notification.findOne({
    name: templateName,
  });

  const notification = {
    greetings: notificationTemp?.greetings,
    name: notificationTemp?.name,
    title: notificationTemp?.title,
    username: data.receiverUsername,
    userId: data.userId,
    content: notificationTemp?.content
      .replace("{{sender_username}}", data.username)
      .replace(
        "{{click_here}}",
        `<a href="/home/chat/${data.userId}" class="text-[var(--custom)]">click here</a>`
      ),
  };
  const newNotification = await UserNotification.create(notification);
  const count = await UserNotification.countDocuments({
    username: data.receiverUsername,
    unread: true,
  });
  return { data: newNotification, count: count };
};
