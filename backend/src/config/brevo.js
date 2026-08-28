// src/config/brevo.js
import { TransactionalEmailsApi, SendSmtpEmail } from '@sendinblue/client';
import dotenv from 'dotenv';

dotenv.config();

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

const sender = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: process.env.BREVO_SENDER_NAME
};

export const sendEmail = async (to, subject, htmlContent, textContent = null) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = Array.isArray(to) ? to : [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    if (textContent) sendSmtpEmail.textContent = textContent;
    sendSmtpEmail.replyTo = { email: process.env.BREVO_REPLY_TO };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return response;
  } catch (error) {
    console.error('Brevo email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendTemplateEmail = async (to, templateId, params = {}) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = Array.isArray(to) ? to : [{ email: to }];
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.params = params;
    sendSmtpEmail.replyTo = { email: process.env.BREVO_REPLY_TO };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return response;
  } catch (error) {
    console.error('Brevo template email error:', error);
    throw new Error(`Failed to send template email: ${error.message}`);
  }
};

export default { sendEmail, sendTemplateEmail };
