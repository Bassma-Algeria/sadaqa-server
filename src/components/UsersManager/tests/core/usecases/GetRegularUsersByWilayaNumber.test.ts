import { expect } from 'chai';

import { clearData } from './base/clearData';
import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';

describe('Get Regular Users By Wilaya numbers', () => {
    const usersManager = aUsersManagerFacade();

    beforeEach(async () => {
        await clearData();
    });

    it('given a get regular users by wilaya request, when no regular users found in that wilaya, then return an emtpy list', async () => {
        const SOME_NUMBER = 39;

        const list = await usersManager.getRegularUsersInWilaya({ wilayaNumber: SOME_NUMBER });

        expect(list).to.have.lengthOf(0);
    });

    it('given a get regular users by wilaya request, when there is an enabled regular user in that wilaya, then return it', async () => {
        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        const list = await usersManager.getRegularUsersInWilaya({
            wilayaNumber: regularUser.wilayaNumber,
        });

        expect(list).to.have.lengthOf(1);
        expect(list[0].accountId).to.equal(accountId);
    });

    it('given a get regular users by wilaya request, when there more than one enabled regular user in that wilaya, then return all of them', async () => {
        const firstUser = aRegularUserRegistrationRequest();
        const secondUser = aRegularUserRegistrationRequest({
            wilayaNumber: firstUser.wilayaNumber,
        });
        await usersManager.registerRegularUser(firstUser);
        await usersManager.registerRegularUser(secondUser);

        const list = await usersManager.getRegularUsersInWilaya({
            wilayaNumber: firstUser.wilayaNumber,
        });

        expect(list).to.have.lengthOf(2);
    });
});
