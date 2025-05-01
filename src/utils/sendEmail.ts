import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import {
  Email,
  Notification,
  UserNotification,
} from "../models/team/emailModel";
import { Company } from "../models/team/companyModel";
import { IChat } from "./userInterface";

interface NotificationData {
  username: string;
  receiverUsername: string;
  userId: string;
  from: string;
}

export async function sendEmail(
  username: string,
  userEmail: string,
  emailName: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    const templatePath = "emailTemplate.html";

    if (!(await fs.stat(templatePath).catch(() => false))) {
      throw new Error(`Template file "${templatePath}" not found`);
    }

    let templateContent = await fs.readFile(templatePath, "utf-8");
    const email = await Email.findOne({ name: emailName });
    const results = await Company.find();
    const company = results[0];

    templateContent = templateContent.replace("{{username}}", username);
    templateContent = templateContent.replace(
      "{{greetings}}",
      String(email?.greetings)
    );
    templateContent = templateContent.replace(
      "{{logo}}",
      `${company?.domain}/images/logos/SchoolingLogo.png`
    );
    templateContent = templateContent.replace(
      "{{whiteLogo}}",
      `${company?.domain}/images/logos/WhiteSchoolingLogo.png`
    );

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: company.email,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`,
      to: userEmail,
      subject: "Your Subject Here",
      html: templateContent,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${email}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", {
        message: error.message,
        stack: error.stack,
        user: userEmail,
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

  const click_here =
    templateName === "friend_request"
      ? `<a href="/home/chat/${data.from}/${data.username}" class="text-[var(--custom)]">click here</a>`
      : "";

  const notification = {
    greetings: notificationTemp?.greetings,
    name: notificationTemp?.name,
    title: notificationTemp?.title,
    username: data.receiverUsername,
    userId: data.userId,
    content: notificationTemp?.content
      .replace("{{sender_username}}", data.username)
      .replace("{{click_here}}", click_here),
  };
  const newNotification = await UserNotification.create(notification);
  const count = await UserNotification.countDocuments({
    username: data.receiverUsername,
    unread: true,
  });
  return { data: newNotification, count: count };
};
