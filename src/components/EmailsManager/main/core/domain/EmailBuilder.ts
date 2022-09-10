import { Email } from './Email';
import { EmailTitle } from './EmailTitle';
import { EmailAddress } from './EmailAddress';
import { EmailTemplate } from './EmailTemplate';
import { EmailAttachments } from './EmailAttachments';
import { EmailCredentials } from './EmailCredentials';

class EmailBuilder {
    private title!: EmailTitle;
    private receiver!: EmailAddress;
    private template!: EmailTemplate;
    private attachments!: EmailAttachments;
    private sender?: EmailCredentials;

    withTitle(title: EmailTitle) {
        this.title = title;
        return this;
    }

    withReceiver(receiver: EmailAddress) {
        this.receiver = receiver;
        return this;
    }

    withTemplate(template: EmailTemplate) {
        this.template = template;
        return this;
    }

    withSenderCredentials(sender: EmailCredentials) {
        this.sender = sender;
        return this;
    }

    withAttachments(attachments: EmailAttachments) {
        this.attachments = attachments;
        return this;
    }

    build() {
        return new Email(this.title, this.receiver, this.template, this.attachments, this.sender);
    }
}

export { EmailBuilder };
