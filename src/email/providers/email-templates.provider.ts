import { Injectable } from '@nestjs/common';
import { EmailTemplateResponse } from '../type/email.type';

@Injectable()
export class EmailTemplatesProvider {
  constructor() {}

  sendForgotPasswordEmail({ link }: { link: string }): EmailTemplateResponse {
    const subject = 'Reset Your Password - Small Bytes'
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
        `

        return {
            subject,
            html
        }
    }

  sendWelcomeEmail({ name }: { name: string }): EmailTemplateResponse {
    const subject = 'Welcome to Small Bytes! 🎉'
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
        `

        return {
            subject,
            html
        }
    }
}
