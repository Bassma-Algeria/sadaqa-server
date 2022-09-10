import { Email } from '../Email';

export interface EmailService {
    sendEmail(email: Email): Promise<void>;
}
