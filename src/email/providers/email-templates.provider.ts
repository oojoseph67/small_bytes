import { Injectable } from '@nestjs/common';
import { EmailTemplateResponse } from '../type/email.type';

@Injectable()
export class EmailTemplatesProvider {
  constructor() {}

  sendForgotPasswordEmail({ link }: { link: string }): EmailTemplateResponse {
    const subject = 'Reset Your Password - Small Bytes';
    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Reset Your Password</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        You requested to reset your password. Click the button below to create a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        If the button doesn't work, you can copy and paste this link into your browser:
                    </p>
                    
                    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0; word-break: break-all;">
                        <a href="${link}" style="color: #007bff; text-decoration: none; font-size: 14px;">${link}</a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                        This is an automated message from Auth Skeleton. Please do not reply to this email.
                    </p>
                </div>
            </div>
        `;

    return {
      subject,
      html,
    };
  }

  sendWelcomeEmail({ name }: { name: string }): EmailTemplateResponse {
    const subject = 'Welcome to Small Bytes! 🎉';
    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to Small Bytes! 🎉</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        Hi ${name},
                    </p>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        Welcome to Small Bytes! We're excited to have you join our community of developers and tech enthusiasts.
                    </p>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        <strong>Great news!</strong> You've been automatically subscribed to our newsletter, so you'll be the first to know about:
                    </p>
                    
                    <ul style="color: #666; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                        <li>Latest tech updates and insights</li>
                        <li>Exclusive content and tutorials</li>
                        <li>Community highlights and events</li>
                        <li>Special offers and announcements</li>
                    </ul>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        We're committed to bringing you valuable, bite-sized content that helps you stay ahead in the tech world.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Explore Small Bytes</a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        If you have any questions or feedback, feel free to reach out to our support team.
                    </p>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        Happy coding!<br>
                        The Small Bytes Team
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                        You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in future emails.
                    </p>
                </div>
            </div>
        `;

    return {
      subject,
      html,
    };
  }

  sendNewsletterEmail({
    subject: newsletterSubject,
    content,
    unsubscribeLink,
  }: {
    subject: string;
    content: string;
    unsubscribeLink?: string;
  }): EmailTemplateResponse {
    // Convert markdown to HTML with basic styling
    const convertMarkdownToHtml = (markdown: string): string => {
      return (
        markdown
          // Headers
          .replace(
            /^### (.*$)/gim,
            '<h3 style="color: #333; margin: 25px 0 15px 0; font-size: 18px;">$1</h3>',
          )
          .replace(
            /^## (.*$)/gim,
            '<h2 style="color: #333; margin: 30px 0 20px 0; font-size: 22px;">$1</h2>',
          )
          .replace(
            /^# (.*$)/gim,
            '<h1 style="color: #333; margin: 35px 0 25px 0; font-size: 26px;">$1</h1>',
          )

          // Bold and italic
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')

          // Links
          .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" style="color: #007bff; text-decoration: none;">$1</a>',
          )

          // Code blocks
          .replace(
            /```([\s\S]*?)```/g,
            '<pre style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto; margin: 15px 0; font-family: monospace; font-size: 14px;">$1</pre>',
          )
          .replace(
            /`([^`]+)`/g,
            '<code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>',
          )

          // Lists
          .replace(/^\* (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')
          .replace(/^- (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')
          .replace(/^\d+\. (.*$)/gim, '<li style="margin: 8px 0;">$1</li>')

          // Wrap lists in ul/ol tags (basic implementation)
          .replace(
            /(<li.*<\/li>)/gs,
            '<ul style="margin: 15px 0; padding-left: 20px;">$1</ul>',
          )

          // Paragraphs
          .replace(
            /^(?!<[h|u|o|p|d|b|t|s|h])(.+)$/gim,
            '<p style="color: #666; line-height: 1.6; margin-bottom: 15px;">$1</p>',
          )

          // Horizontal rules
          .replace(
            /^---$/gim,
            '<hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">',
          )

          // Blockquotes
          .replace(
            /^> (.*$)/gim,
            '<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666; font-style: italic;">$1</blockquote>',
          )

          // Clean up empty paragraphs
          .replace(
            /<p style="color: #666; line-height: 1.6; margin-bottom: 15px;"><\/p>/g,
            '',
          )

          // Clean up multiple consecutive p tags
          .replace(
            /<\/p>\s*<p style="color: #666; line-height: 1.6; margin-bottom: 15px;">/g,
            '<br><br>',
          )
      );
    };

    const convertedContent = convertMarkdownToHtml(content);

    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">Small Bytes</h1>
                        <p style="color: #666; margin: 0; font-size: 14px;">Your daily dose of tech insights</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="color: #333; line-height: 1.6;">
                        ${convertedContent}
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #666; margin-bottom: 15px;">Thanks for reading!</p>
                        <p style="color: #666; margin-bottom: 20px;">The Small Bytes Team</p>
                        
                        <div style="margin: 20px 0;">
                            <a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">Visit Website</a>
                            <a href="#" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">Follow Us</a>
                        </div>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                            You're receiving this email because you're subscribed to Small Bytes newsletter.
                        </p>
                        ${
                          unsubscribeLink
                            ? `
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            <a href="${unsubscribeLink}" style="color: #999; text-decoration: underline;">Unsubscribe</a> | 
                            <a href="#" style="color: #999; text-decoration: underline;">Update preferences</a>
                        </p>
                        `
                            : `
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            <a href="#" style="color: #999; text-decoration: underline;">Unsubscribe</a> | 
                            <a href="#" style="color: #999; text-decoration: underline;">Update preferences</a>
                        </p>
                        `
                        }
                    </div>
                </div>
            </div>
        `;

    return {
      subject: newsletterSubject,
      html,
    };
  }
}
