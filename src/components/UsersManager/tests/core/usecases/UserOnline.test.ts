import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';

describe('User Online', () => {
    const usersManager = aUsersManagerFacade();

    it('given no users are online, when getting the online users, then return an empty list', async () => {
        const { list } = await usersManager.getOnlineUsersList();

        expect(list).to.have.lengthOf(0);
    });

    it('given a user became online, when getting the online users, then have that user account id in the online users list', async () => {
        const accountId = faker.datatype.uuid();

        await usersManager.userBecameOnline({ accountId });

        const { list } = await usersManager.getOnlineUsersList();

        expect(list).to.contain(accountId);
    });

    it('given a user became online, and then sending another user became online request with the same user, then should not have a duplicate in the list', async () => {
        const accountId = faker.datatype.uuid();

        const { list: listBefore } = await usersManager.getOnlineUsersList();

        await usersManager.userBecameOnline({ accountId });
        await usersManager.userBecameOnline({ accountId });

        const { list: listAfter } = await usersManager.getOnlineUsersList();

        expect(listAfter)
            .to.have.lengthOf(listBefore.length + 1)
            .and.contain(accountId);
    });

    it('given a user became online, when that user go offline, then should not have that user in the online users list', async () => {
        const accountId = faker.datatype.uuid();

        await usersManager.userBecameOnline({ accountId });

        const { list: listAfterHeBecameOnline } = await usersManager.getOnlineUsersList();

        await usersManager.userGoOffline({ accountId });

        const { list: listAfterHeGoOffline } = await usersManager.getOnlineUsersList();

        expect(listAfterHeBecameOnline).to.contain(accountId);

        expect(listAfterHeGoOffline).to.not.contain(accountId);

        expect(listAfterHeGoOffline).to.have.lengthOf(listAfterHeBecameOnline.length - 1);
    });
});
