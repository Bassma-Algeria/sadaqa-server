import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { Email } from '../../core/domain/Email';

import { EmailService } from '../../core/domain/services/EmailService';

class FakeEmailService implements EmailService {
    async sendEmail(email: Email): Promise<void> {
        // this email is generated using "https://ethereal.email"
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'justice95@ethereal.email',
                pass: 'w6YjQFhp8ZHTFCtn2K',
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

export { FakeEmailService };
