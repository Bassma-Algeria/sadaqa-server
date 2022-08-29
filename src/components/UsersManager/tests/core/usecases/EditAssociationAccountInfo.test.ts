import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anEditAssociationInfoRequest } from './base/requests/anEditAssociationInfoRequest';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';

import { FakePicturesManager } from '../../../main/infra/fake/FakePicturesManager';

import { ProfilePicture } from '../../../main/core/domain/ProfilePicture';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Edit Association Account Info', () => {
    const mockWilayaService = mock<WilayasService>();
    const picturesManager = new FakePicturesManager();
    const usersManager = aUsersManagerFacade({
        wilayasService: instance(mockWilayaService),
        picturesManager,
    });

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

    it('given an edit association account info, when the there is a new profile picture sent, then should update the old one', async () => {
        const uploadSpy = spy(picturesManager, 'uploadProfilePicture');

        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        const request = anEditAssociationInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editAssociationAccountInfo(request);

        const { profilePicture } = await usersManager.getAssociationById({ accountId });

        expect(uploadSpy.calledOnce).to.equal(true);
        expect(uploadSpy.args[0][0]).to.equal(request.profilePicture);
        expect(new ProfilePicture(profilePicture!)).to.deep.equal(await uploadSpy.returnValues[0]);

        uploadSpy.restore();
    });

    it('given an edit association account info, when the there is a new profile picture sent, then should delete the old one if there is any', async () => {
        const deleteSpy = spy(picturesManager, 'deleteProfilePicture');

        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        const firstUpdatedPicture = await addProfilePicture(accountId);

        const request = anEditAssociationInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editAssociationAccountInfo(request);

        expect(deleteSpy.calledOnce).to.equal(true);
        expect(deleteSpy.args[0][0]).to.deep.equal(new ProfilePicture(firstUpdatedPicture!));

        deleteSpy.restore();
    });

    it('given an edit association account info, when the the profile picture sent is null, then should set the account profile picture to null', async () => {
        const uploadSpy = spy(picturesManager, 'uploadProfilePicture');

        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        await usersManager.editAssociationAccountInfo(
            anEditAssociationInfoRequest({ accountId, profilePicture: null }),
        );

        const { profilePicture } = await usersManager.getAssociationById({ accountId });

        expect(uploadSpy.calledOnce).to.equal(false);
        expect(profilePicture).to.equal(null);

        uploadSpy.restore();
    });

    it('given an edit association account info, when the the profile picture sent is null, then should delete the old picture if there is any', async () => {
        const deleteSpy = spy(picturesManager, 'deleteProfilePicture');

        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        const profilePicture = await addProfilePicture(accountId);

        await usersManager.editAssociationAccountInfo(
            anEditAssociationInfoRequest({ accountId, profilePicture: null }),
        );

        expect(deleteSpy.calledOnce).to.equal(true);
        expect(deleteSpy.args[0][0]).to.deep.equal(new ProfilePicture(profilePicture!));

        deleteSpy.restore();
    });

    it('given an edit association account info, when the the profile picture sent is the old picture, then not update the pic', async () => {
        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        const profilePicture = await addProfilePicture(accountId);

        await usersManager.editAssociationAccountInfo(
            anEditAssociationInfoRequest({ accountId, profilePicture }),
        );

        const { profilePicture: picAfterEdit } = await usersManager.getAssociationById({
            accountId,
        });

        expect(picAfterEdit).to.equal(profilePicture);
    });

    it('given an edit association account info, when the the profile picture sent is a string but not the old picture, then should fail', async () => {
        const user = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(user);

        await addProfilePicture(accountId);

        await expect(
            usersManager.editAssociationAccountInfo(
                anEditAssociationInfoRequest({ accountId, profilePicture: faker.image.imageUrl() }),
            ),
        )
            .to.eventually.rejectedWith(ExceptionMessages.PROFILE_PIC_SENT_NOT_THE_OLD_PIC)
            .and.to.be.an.instanceOf(ValidationException);
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

    async function addProfilePicture(accountId: string) {
        const request = anEditAssociationInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editAssociationAccountInfo(request);

        const { profilePicture } = await usersManager.getAssociationById({ accountId });
        return profilePicture;
    }
});
