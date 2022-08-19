import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from '../base/SetupNestE2E';

import { sendTextMessage } from '../base/operations/messages/sendTextMessage';
import { createDonation } from '../base/operations/posts/donation/createDonation';
import { registerRegularUser } from '../base/operations/users/registerRegularUser';
import { getDonationById } from '../base/operations/posts/donation/getDonationById';
import { getNotifications } from '../base/operations/notifications/getNotifications';
import { getRegularUserByToken } from '../base/operations/users/getRegularUserByToken';

describe('Message Notification', () => {
    let app: INestApplication;
    let server: any;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    beforeEach(async () => {
        await cleanupDB();
    });

    after(async () => {
        await app.close();
    });

    it('a user create an account and publish a post, another user came in, found that post, and send a message to his publisher', async () => {
        const { accessToken: token1 } = await registerRegularUser(server);
        const { postId } = await createDonation(server, token1);

        const { accessToken: token2 } = await registerRegularUser(server);
        const {
            info: { accountId: accountId2 },
        } = await getRegularUserByToken(server, token2);

        const {
            post: { publisherId },
        } = await getDonationById(server, postId);

        await sendTextMessage(server, token2, { receiverId: publisherId });

        await delay(30);

        const { list } = await getNotifications(server, token1);

        expect(list).to.have.lengthOf(1);
        expect(list[0].type).to.equal('NEW_TEXT_MESSAGE');
        expect(list[0].notification).to.have.property('messageSenderId', accountId2);
    });

    const delay = async (period: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, period);
        });
    };
});
