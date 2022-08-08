import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anEditAssociationInfoRequest } from './base/requests/anEditAssociationInfoRequest';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Edit Association Account Info', () => {
    const mockWilayaService = mock<WilayasService>();
    const usersManager = aUsersManagerFacade({ wilayasService: instance(mockWilayaService) });

    beforeEach(() => {
        when(mockWilayaService.isExist(anything())).thenResolve(true);
    });

    it('given an edit association account info, when the account does not exist, then should fail', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ accountId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given an edit association account info, when the association name is short, then should fail', async () => {
        const SHORT_NAME = 'sl';
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ associationName: SHORT_NAME, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_NAME.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account info, when the wilaya does not exist, then should fail', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        when(mockWilayaService.isExist(anything())).thenResolve(false);

        await expect(
            usersManager.editAssociationAccountInfo(anEditAssociationInfoRequest({ accountId })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account info, when the phone number is not valid, then should fail', async () => {
        const INVALID_PHONE = faker.random.numeric(10);

        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ phoneNumber: INVALID_PHONE, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PHONE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account info, when the phone number is used by anther regular user, then should fail', async () => {
        const anotherUser = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(anotherUser);

        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ phoneNumber: anotherUser.phoneNumber, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account info, when the phone number is used by anther association, then should fail', async () => {
        const association = anAssociationRegistrationRequest();
        await usersManager.registerAssociation(association);

        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ phoneNumber: association.phoneNumber, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account info, when the phone number is same as the old one, then should pass with no problem', async () => {
        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ phoneNumber: user.phoneNumber, accountId }),
            ),
        ).to.eventually.be.fulfilled;
    });

    it('given an edit association account info, when everything is ok, then should edit the user info', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        const editedInfo = anEditAssociationInfoRequest({ accountId });
        await usersManager.editAssociationAccountInfo(editedInfo);

        const editedUser = await usersManager.getAssociationById({ accountId });

        expect(editedUser.associationName).to.equal(editedInfo.associationName);
        expect(editedUser.wilayaNumber).to.equal(editedInfo.wilayaNumber);
    });

    it('given an edit association account info, when everything is ok, then should return the edited user info', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        const returned = await usersManager.editAssociationAccountInfo(
            anEditAssociationInfoRequest({ accountId }),
        );

        const editedUser = await usersManager.getAssociationById({ accountId });

        expect(editedUser).to.deep.equal(returned);
    });

    it('given an edit association account info, when everything is ok, then publish a association account info edited event to the global event bus', async () => {
        const mockFn = spy();

        EventBus.getInstance().subscribeTo('ASSOCIATION_ACCOUNT_INFO_EDITED').by(mockFn);

        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );
        await usersManager.editAssociationAccountInfo(anEditAssociationInfoRequest({ accountId }));

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('accountId', accountId);
    });
});