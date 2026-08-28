// src/services/emailService.js
import { sendEmail } from '../config/brevo.js';
import Contact from '../models/Contact.js';

class EmailService {
  async sendContactEmail(contactData) {
    const { name, email, subject, message, ip } = contactData;

    // Save contact to database
    try {
      const contact = new Contact({
        name,
        email,
        subject,
        message,
        ip,
        status: 'new'
      });
      await contact.save();
    } catch (error) {
      console.error('Save contact error:', error);
      // Continue with email even if save fails
    }

    // Email to yourself (portfolio owner)
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b, #2563eb); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #eef2f6; border-radius: 0 0 12px 12px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #1e293b; }
          .value { background: white; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 4px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">📨 New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Name</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${subject ? `
          <div class="field">
            <div class="label">📝 Subject</div>
            <div class="value">${subject}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">💬 Message</div>
            <div class="value" style="white-space: pre-wrap;">${message}</div>
          </div>
          <div class="footer">
            <p>Sent from your portfolio website</p>
            <p style="font-size: 0.8rem;">IP: ${ip || 'Not available'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Auto-reply to sender
    const autoReplyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b, #2563eb); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #eef2f6; border-radius: 0 0 12px 12px; }
          .signature { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
          .highlight { color: #2563eb; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">👋 Thank You for Reaching Out!</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for contacting me through my portfolio website. I appreciate your interest in my work.</p>
          <p>I have received your message and will review it carefully. I aim to respond to all inquiries within <span class="highlight">24-48 hours</span>.</p>
          <p>In the meantime, you can connect with me on:</p>
          <ul>
            <li><a href="https://www.linkedin.com/in/peter-ukpabi-uche/">LinkedIn</a></li>
            <li><a href="https://github.com/bigcephas1">GitHub</a></li>
          </ul>
          <div class="signature">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">Peter Uchenna Ukpabi</p>
            <p style="margin: 0; color: #64748b;">DevSecOps & Cloud Engineer</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Send email to portfolio owner
      await sendEmail(
        process.env.BREVO_REPLY_TO,
        subject ? `New Contact: ${subject}` : 'New Contact Form Submission',
        ownerEmailHtml
      );

      // Send auto-reply to sender
      await sendEmail(
        email,
        'Thank You for Contacting Peter Uchenna Ukpabi',
        autoReplyHtml
      );

      return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error(`Failed to send emails: ${error.message}`);
    }
  }

  // Get all contacts with pagination
  async getContacts(page = 1, limit = 20, status = null) {
    try {
      const query = status ? { status } : {};
      const skip = (page - 1) * limit;
      
      const [contacts, total] = await Promise.all([
        Contact.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Contact.countDocuments(query)
      ]);
      
      return {
        contacts,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get contacts error:', error);
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }
  }

  // Update contact status
  async updateContactStatus(contactId, status, notes = '') {
    try {
      const contact = await Contact.findByIdAndUpdate(
        contactId,
        { 
          status, 
          ...(status === 'replied' && { repliedAt: new Date() }),
          ...(notes && { notes })
        },
        { new: true }
      );
      return contact;
    } catch (error) {
      console.error('Update contact error:', error);
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }
}

export default new EmailService();
