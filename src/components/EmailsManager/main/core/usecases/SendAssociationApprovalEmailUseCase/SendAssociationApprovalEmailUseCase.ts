import { UseCase } from '../UseCase';
import { SendAssociationApprovalEmailUseCaseRequest } from './SendAssociationApprovalEmailUseCaseRequest';

import { Email } from '../../domain/Email';
import { EmailTitle } from '../../domain/EmailTitle';
import { EmailAddress } from '../../domain/EmailAddress';
import { EmailAttachments } from '../../domain/EmailAttachments';
import { AssociationApprovalEmailTemplate } from '../../domain/AssociationApprovalEmailTemplate';

import { EmailService } from '../../domain/services/EmailService';
import { EmailEventPublisher } from '../../domain/services/EmailEventPublisher';

class SendAssociationApprovalEmailUseCase
    implements UseCase<SendAssociationApprovalEmailUseCaseRequest, void>
{
    private readonly YASSER_EMAIL = 'yasser.belatreche0@gmail.com';

    constructor(
        private readonly emailService: EmailService,
        private readonly emailEventPublisher: EmailEventPublisher,
    ) {}

    async handle(request: SendAssociationApprovalEmailUseCaseRequest): Promise<void> {
        const title = new EmailTitle('New Association Wanna Join Sadaqa !');
        const receiver = new EmailAddress(this.YASSER_EMAIL);
        const emailTemplate = this.buildTemplateFrom(request);
        const attachments = this.getAssociationDocsAttachmentsFrom(request);

        const email = Email.aBuilder()
            .withTitle(title)
            .withReceiver(receiver)
            .withTemplate(emailTemplate)
            .withAttachments(attachments)
            .build();

        await this.emailService.sendEmail(email);
        await this.emailEventPublisher.publishAssociationApprovalEmailSent(
            email,
            request.accountId,
        );
    }

    private buildTemplateFrom(request: SendAssociationApprovalEmailUseCaseRequest) {
        return AssociationApprovalEmailTemplate.aBuilder()
            .withId(request.accountId)
            .withEmail(request.email)
            .withAssociationName(request.associationName)
            .withPhoneNumber(request.phoneNumber)
            .withWilayaNumber(request.wilayaNumber)
            .build();
    }

    private getAssociationDocsAttachmentsFrom(request: SendAssociationApprovalEmailUseCaseRequest) {
        const attachments = new EmailAttachments();

        for (const associationDoc of request.associationDocs)
            attachments.add({ name: 'Association Document.png', value: associationDoc });

        return attachments;
    }
}

export { SendAssociationApprovalEmailUseCase };
