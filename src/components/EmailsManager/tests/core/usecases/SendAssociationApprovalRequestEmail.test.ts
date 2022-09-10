import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, reset, when } from 'ts-mockito';

import { anEmailsManager } from './base/anEmailsManager';

import { EmailService } from '../../../main/core/domain/services/EmailService';

import { SendAssociationApprovalEmailUseCaseRequest } from '../../../main/core/usecases/SendAssociationApprovalEmailUseCase/SendAssociationApprovalEmailUseCaseRequest';

import { InMemoryEventBus } from '../../../../EventBus/main/InMemoryEventBus';

describe('Send Association Approval Request Email', () => {
    const emailServiceMock = mock<EmailService>();
    const emailsManager = anEmailsManager({ emailService: instance(emailServiceMock) });

    beforeEach(() => {
        reset(emailServiceMock);

        when(emailServiceMock.sendEmail(anything())).thenResolve();
    });

    it('given a new send association approval email request, when sending the email, should publish a notification to the global event bus', async () => {
        const mockFn = spy();
        InMemoryEventBus.instance().subscribeTo('ASSOCIATION_APPROVAL_EMAIL_SENT').by(mockFn);

        const association = anAssociationApprovalEmailRequest();
        await emailsManager.sendAssociationApprovalEmail(association);

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('associationId', association.accountId);
    });

    it('given a new send association approval email request, then should send an email to the admin: yasser', async () => {
        const mockFn = spy();
        InMemoryEventBus.instance().subscribeTo('ASSOCIATION_APPROVAL_EMAIL_SENT').by(mockFn);

        await emailsManager.sendAssociationApprovalEmail(anAssociationApprovalEmailRequest());

        const YASSER_EMAIL = 'yasser.belatreche0@gmail.com';
        expect(mockFn.args[0][0]).to.have.property('receiver', YASSER_EMAIL);
    });

    const anAssociationApprovalEmailRequest = (): SendAssociationApprovalEmailUseCaseRequest => {
        return {
            accountId: faker.datatype.uuid(),
            associationName: faker.lorem.words(3),
            email: faker.internet.email(),
            wilayaNumber: faker.datatype.number(),
            phoneNumber: faker.phone.number(),
            associationDocs: [],
        };
    };
});
