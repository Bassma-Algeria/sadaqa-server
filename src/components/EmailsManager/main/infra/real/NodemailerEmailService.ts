import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { Email } from '../../core/domain/Email';

import { EmailService } from '../../core/domain/services/EmailService';

class NodemailerEmailService implements EmailService {
    async sendEmail(email: Email): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: 'gmail',
            auth: {
                user: email.getSenderEmail(),
                pass: email.getSenderPassword(),
            },
        });

        const attachments: Mail.Attachment[] = [];
        for (const { name, value } of email.getAttachments().iterator())
            attachments.push({ filename: name, content: value });

        await transporter.sendMail({
            from: email.getSenderEmail(),
            subject: email.getTitle(),
            to: email.getReceiverEmail(),
            html: email.getTemplate(),
            attachments,
        });
    }
}

export { NodemailerEmailService };
