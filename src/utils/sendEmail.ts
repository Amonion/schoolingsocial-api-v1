import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

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
