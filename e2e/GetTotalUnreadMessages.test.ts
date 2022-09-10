import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { startNestTestingApp } from './base/SetupNestE2E';

import { sendTextMessage } from './base/operations/messages/sendTextMessage';
import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { getRegularUserByToken } from './base/operations/users/getRegularUserByToken';
import { getTotalUnreadMessages } from './base/operations/messages/getTotalUnreadMessages';

describe('Get Total Unread Messages', () => {
    let app: INestApplication;
    let server: any;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    after(async () => {
        await app.close();
    });

    it('a user register, and have 0 total unread messages, then he receive a new message and the number of unread messages increase', async () => {
        const { accessToken: token1 } = await registerRegularUser(server);
        const {
            info: { accountId: accountId1 },
        } = await getRegularUserByToken(server, token1);

        const { total: totalBefore } = await getTotalUnreadMessages(server, token1);

        const { accessToken: token2 } = await registerRegularUser(server);

        await sendTextMessage(server, token2, { receiverId: accountId1 });

        const { total: totalAfter } = await getTotalUnreadMessages(server, token1);

        expect(totalBefore).to.equal(0);
        expect(totalAfter).to.equal(1);
    });
});
