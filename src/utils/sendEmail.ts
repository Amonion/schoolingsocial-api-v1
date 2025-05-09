import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import {
  Email,
  Notification,
  UserNotification,
} from "../models/team/emailModel";
import { Company } from "../models/team/companyModel";

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
): Promise<boolean> {
  try {
    const templatePath = path.join(__dirname, "emailTemplate.html");

    // Check if the template file exists
    await fs.access(templatePath);

    let templateContent = await fs.readFile(templatePath, "utf-8");
    const email = await Email.findOne({ name: emailName });
    const [company] = await Company.find();

    if (!email || !company) {
      throw new Error("Missing email or company data.");
    }

    // Replace template variables
    templateContent = templateContent
      .replace("{{username}}", username)
      .replace("{{greetings}}", String(email.greetings))
      .replace("{{logo}}", `${company.domain}/images/logos/SchoolingLogo.png`)
      .replace(
        "{{whiteLogo}}",
        `${company.domain}/images/logos/WhiteSchoolingLogo.png`
      );

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
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: email.title,
      html: templateContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", {
        message: error.message,
        stack: error.stack,
        user: userEmail,
      });
    } else {
      console.error("Unknown error:", error);
    }
    return false;
  }
}

export const sendNotification = async (
  templateName: string,
  data: NotificationData
) => {
  const notificationTemp = await Notification.findOne({ name: templateName });

  if (!notificationTemp) {
    throw new Error(`Notification template '${templateName}' not found.`);
  }

  const click_here =
    templateName === "friend_request"
      ? `<a href="/home/chat/${data.from}/${data.username}" class="text-[var(--custom)]">click here</a>`
      : "";

  const content = notificationTemp.content
    .replace("{{sender_username}}", data.username)
    .replace("{{click_here}}", click_here);

  const newNotification = await UserNotification.create({
    greetings: notificationTemp.greetings,
    name: notificationTemp.name,
    title: notificationTemp.title,
    username: data.receiverUsername,
    userId: data.userId,
    content,
  });

  const count = await UserNotification.countDocuments({
    username: data.receiverUsername,
    unread: true,
  });

  return { data: newNotification, count };
};
