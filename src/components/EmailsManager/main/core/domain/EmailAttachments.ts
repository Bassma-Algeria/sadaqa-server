interface Attachment {
    name: string;
    value: Buffer;
}

class EmailAttachments {
    private readonly attachments: Attachment[] = [];

    add(attachment: Attachment) {
        this.attachments.push(attachment);
    }

    *iterator() {
        for (const attachment of this.attachments) {
            yield attachment;
        }
    }
}

export { EmailAttachments };
