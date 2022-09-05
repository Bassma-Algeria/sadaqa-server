import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anEditRegularUserInfoRequest } from './base/requests/anEditRegularUserInfoRequest';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';

import { ProfilePicture } from '../../../main/core/domain/ProfilePicture';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';

import { FakePicturesManager } from '../../../main/infra/fake/FakePicturesManager';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

describe('Edit Regular User Account Info', () => {
    const mockWilayaService = mock<WilayasService>();
    const picturesManager = new FakePicturesManager();
    const usersManager = aUsersManagerFacade({
        wilayasService: instance(mockWilayaService),
        picturesManager,
    });

    beforeEach(() => {
        when(mockWilayaService.isExist(anything())).thenResolve(true);
    });

    it('given an edit regular user account info, when the account does not exist, then should fail', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ accountId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given an edit regular user account info, when the first name is short, then should fail', async () => {
        const SHORT_NAME = 'sl';
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ firstName: SHORT_NAME, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_NAME.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the last name is short, then should fail', async () => {
        const SHORT_NAME = 'sl';
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ lastName: SHORT_NAME, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_NAME.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the wilaya does not exist, then should fail', async () => {
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        when(mockWilayaService.isExist(anything())).thenResolve(false);

        await expect(
            usersManager.editRegularUserAccountInfo(anEditRegularUserInfoRequest({ accountId })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the phone number is not valid, then should fail', async () => {
        const INVALID_PHONE = faker.random.numeric(10);

        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ phoneNumber: INVALID_PHONE, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PHONE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the phone number is used by anther regular user, then should fail', async () => {
        const anotherUser = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(anotherUser);

        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ phoneNumber: anotherUser.phoneNumber, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the phone number is used by anther association, then should fail', async () => {
        const association = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(association);

        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ phoneNumber: association.phoneNumber, accountId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular user account info, when the phone number is same as the old one, then should pass with no problem', async () => {
        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ phoneNumber: user.phoneNumber, accountId }),
            ),
        ).to.eventually.be.fulfilled;
    });

    it('given an edit regular user account info, when the there is a new profile picture sent, then should update the old one', async () => {
        const uploadSpy = spy(picturesManager, 'uploadProfilePicture');

        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        const request = anEditRegularUserInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editRegularUserAccountInfo(request);

        const { profilePicture } = await usersManager.getRegularUserById({ accountId });

        expect(uploadSpy.calledOnce).to.equal(true);
        expect(uploadSpy.args[0][0]).to.equal(request.profilePicture);
        expect(new ProfilePicture(profilePicture!)).to.deep.equal(await uploadSpy.returnValues[0]);

        uploadSpy.restore();
    });

    it('given an edit regular user account info, when the there is a new profile picture sent, then should delete the old one if there is any', async () => {
        const deleteSpy = spy(picturesManager, 'deleteProfilePicture');

        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        const firstUpdatedPicture = await addProfilePicture(accountId);

        const request = anEditRegularUserInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editRegularUserAccountInfo(request);

        expect(deleteSpy.calledOnce).to.equal(true);
        expect(deleteSpy.args[0][0]).to.deep.equal(new ProfilePicture(firstUpdatedPicture!));

        deleteSpy.restore();
    });

    it('given an edit regular user account info, when the the profile picture sent is null, then should set the account profile picture to null', async () => {
        const uploadSpy = spy(picturesManager, 'uploadProfilePicture');

        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        await usersManager.editRegularUserAccountInfo(
            anEditRegularUserInfoRequest({ accountId, profilePicture: null }),
        );

        const { profilePicture } = await usersManager.getRegularUserById({ accountId });

        expect(uploadSpy.calledOnce).to.equal(false);
        expect(profilePicture).to.equal(null);

        uploadSpy.restore();
    });

    it('given an edit regular user account info, when the the profile picture sent is null, then should delete the old picture if there is any', async () => {
        const deleteSpy = spy(picturesManager, 'deleteProfilePicture');

        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        const profilePicture = await addProfilePicture(accountId);

        await usersManager.editRegularUserAccountInfo(
            anEditRegularUserInfoRequest({ accountId, profilePicture: null }),
        );

        expect(deleteSpy.calledOnce).to.equal(true);
        expect(deleteSpy.args[0][0]).to.deep.equal(new ProfilePicture(profilePicture!));

        deleteSpy.restore();
    });

    it('given an edit regular user account info, when the the profile picture sent is the old picture, then not update the pic', async () => {
        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        const profilePicture = await addProfilePicture(accountId);

        await usersManager.editRegularUserAccountInfo(
            anEditRegularUserInfoRequest({ accountId, profilePicture }),
        );

        const { profilePicture: picAfterEdit } = await usersManager.getRegularUserById({
            accountId,
        });

        expect(picAfterEdit).to.equal(profilePicture);
    });

    it('given an edit regular user account info, when the the profile picture sent is a string but not the old picture, then should fail', async () => {
        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        await addProfilePicture(accountId);

        await expect(
            usersManager.editRegularUserAccountInfo(
                anEditRegularUserInfoRequest({ accountId, profilePicture: faker.image.imageUrl() }),
            ),
        )
            .to.eventually.rejectedWith(ExceptionMessages.PROFILE_PIC_SENT_NOT_THE_OLD_PIC)
            .and.to.be.an.instanceOf(ValidationException);
    });

    it('given an edit regular user account info, when everything is ok, then should edit the user info', async () => {
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        const editedInfo = anEditRegularUserInfoRequest({ accountId });
        await usersManager.editRegularUserAccountInfo(editedInfo);

        const editedUser = await usersManager.getRegularUserById({ accountId });

        expect(editedUser.lastName).to.equal(editedInfo.lastName);
        expect(editedUser.firstName).to.equal(editedInfo.firstName);
        expect(editedUser.wilayaNumber).to.equal(editedInfo.wilayaNumber);
    });

    it('given an edit regular user account info, when everything is ok, then should return the edited user info', async () => {
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        const returned = await usersManager.editRegularUserAccountInfo(
            anEditRegularUserInfoRequest({ accountId }),
        );

        const editedUser = await usersManager.getRegularUserById({ accountId });

        expect(editedUser).to.deep.equal(returned);
    });

    async function addProfilePicture(accountId: string) {
        const request = anEditRegularUserInfoRequest({
            accountId,
            profilePicture: { filename: faker.system.fileName(), buffer: Buffer.from('RANDOM') },
        });
        await usersManager.editRegularUserAccountInfo(request);

        const { profilePicture } = await usersManager.getRegularUserById({ accountId });
        return profilePicture;
    }
});
