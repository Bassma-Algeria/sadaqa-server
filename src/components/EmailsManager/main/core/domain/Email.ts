import { EmailTitle } from './EmailTitle';
import { EmailAddress } from './EmailAddress';
import { EmailBuilder } from './EmailBuilder';
import { EmailTemplate } from './EmailTemplate';
import { EmailCredentials } from './EmailCredentials';
import { EmailAttachments } from './EmailAttachments';
import { BassmaEmailCredentials } from './BassmaEmailCredentials';

class Email {
    static aBuilder() {
        return new EmailBuilder();
    }

    private readonly senderCredentials: EmailCredentials = BassmaEmailCredentials.instance();

    constructor(
        private readonly title: EmailTitle,
        private readonly receiver: EmailAddress,
        private readonly template: EmailTemplate,
        private readonly attachments: EmailAttachments,
        senderCredentials?: EmailCredentials,
    ) {
        if (senderCredentials) this.senderCredentials = senderCredentials;
    }

    getTitle() {
        return this.title.value();
    }

    getReceiverEmail() {
        return this.receiver.value();
    }

    getSenderEmail() {
        return this.senderCredentials.email().value();
    }

    getSenderPassword() {
        return this.senderCredentials.password().value();
    }

    getTemplate() {
        return this.template.buildTemplate();
    }

    getAttachments() {
        return this.attachments;
    }
}

export { Email };
