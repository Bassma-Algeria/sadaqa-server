import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Register Association', () => {
    const wilayasServiceMock = mock<WilayasService>();
    const usersManager = aUsersManagerFacade({ wilayasService: instance(wilayasServiceMock) });

    beforeEach(() => {
        when(wilayasServiceMock.isExist(anything())).thenResolve(true);
    });

    it('given a registration request, the email should be valid', async () => {
        const INVALID_EMAIL = faker.lorem.words(5);
        const request = anAssociationRegistrationRequest({ email: INVALID_EMAIL });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_EMAIL.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, the phone number should be valid', async () => {
        const INVALID_PHONE_NUMBER = faker.datatype.number().toString();
        const request = anAssociationRegistrationRequest({ phoneNumber: INVALID_PHONE_NUMBER });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PHONE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, the association name should have more that 3 characters', async () => {
        const INVALID_NAME = faker.lorem.word(2);
        const request = anAssociationRegistrationRequest({ associationName: INVALID_NAME });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_NAME.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, the password should have more that 6 characters', async () => {
        const INVALID_PASSWORD = faker.internet.password(5);
        const request = anAssociationRegistrationRequest({ password: INVALID_PASSWORD });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_PASSWORD.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, the wilaya number should be valid', async () => {
        when(wilayasServiceMock.isExist(anything())).thenResolve(false);

        const INVALID_WILAYA_NUMBER = faker.datatype.number();
        const request = anAssociationRegistrationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, the password should equal the confirm password', async () => {
        const password = faker.internet.password(10);
        const confirmPassword = faker.internet.password(11);
        const request = anAssociationRegistrationRequest({ password, confirmPassword });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.PASSWORD_MISS_MATCH.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a registration request, should at least provide one association document', async () => {
        const request = anAssociationRegistrationRequest({ associationDocs: [] });

        await expect(usersManager.registerAssociation(request))
            .to.eventually.be.rejectedWith(ExceptionMessages.NO_ASSOCIATION_DOCS.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given X registration requests, should have a unique accountId for each association', async () => {
        const { accountId: id1 } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );
        const { accountId: id2 } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        expect(id1).to.not.equal(id2);
    });

    it('given X registration requests, should not have two associations with the same email', async () => {
        const SAME_EMAIL = faker.internet.email();

        await usersManager.registerAssociation(
            anAssociationRegistrationRequest({ email: SAME_EMAIL }),
        );

        await expect(
            usersManager.registerAssociation(
                anAssociationRegistrationRequest({ email: SAME_EMAIL }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given X registration requests, should not have two associations with the same phone number', async () => {
        const SAME_PHONE = faker.phone.number('05 ## ## ## ##');

        await usersManager.registerAssociation(
            anAssociationRegistrationRequest({ phoneNumber: SAME_PHONE }),
        );

        await expect(
            usersManager.registerAssociation(
                anAssociationRegistrationRequest({ phoneNumber: SAME_PHONE }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an association registration requests, when the registration complete, the association should not have a profile picture', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        const { profilePicture } = await usersManager.getAssociationById({ accountId });
        expect(profilePicture).to.equal(null);
    });

    it('given an association registration requests, when the registration complete, the association should be waiting for admin validation', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        const { status } = await usersManager.getAssociationById({ accountId });

        expect(status).to.equal('WAITING_FOR_ADMIN_VALIDATION');
    });

    it('should publish an association registered event when the association is registered', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('ASSOCIATION_REGISTERED').by(mockFn);

        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('accountId', accountId);
    });
});
