import { anything, instance, mock, when } from 'ts-mockito';

import { EmailService } from '../../../../main/core/domain/services/EmailService';

import { EmailEventPublisherImpl } from '../../../../main/infra/real/EmailEventPublisherImpl';

import { EmailsManagerFacade } from '../../../../main/EmailsManagerFacade';

import { InMemoryEventBus } from '../../../../../EventBus/main/InMemoryEventBus';

interface Dependencies {
    emailService: EmailService;
}

const anEmailsManager = (depends?: Dependencies) => {
    const emailServiceMock = mock<EmailService>();

    when(emailServiceMock.sendEmail(anything())).thenResolve();

    return new EmailsManagerFacade(
        depends?.emailService || instance(emailServiceMock),
        new EmailEventPublisherImpl(InMemoryEventBus.instance()),
    );
};

export { anEmailsManager };
