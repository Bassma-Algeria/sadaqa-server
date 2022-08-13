import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aTogglePostEnablingStatusRequest } from '../base/requests/aTogglePostEnablingStatusRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';

describe('Toggle Call For Help Post Enabling Status', () => {
    const callForHelpPostsManager = aCallForHelpPostsManager();

    it('given a toggle call for help enabling status request, when the postId not exist, should throw a not found exception', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            callForHelpPostsManager.toggleEnablingStatus(
                aTogglePostEnablingStatusRequest({ postId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a toggle call for help enabling status request, when the userId is not the publisher, should throw a not authorized exception', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        await expect(
            callForHelpPostsManager.toggleEnablingStatus(
                aTogglePostEnablingStatusRequest({ postId, userId: NOT_PUBLISHER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_EDIT)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a toggle call for help enabling status request, when the userId is the publisher and the post is enabled, should make it disabled', async () => {
        const post = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(post);

        const { status: statusBeforeToggle } = await callForHelpPostsManager.getById({ postId });

        await callForHelpPostsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusAfterToggle } = await callForHelpPostsManager.getById({ postId });

        expect(statusBeforeToggle).to.equal('ENABLED');
        expect(statusAfterToggle).to.equal('DISABLED');
    });

    it('given a toggle call for help enabling status request, when the userId is the publisher and the post is disabled, should make it enabled', async () => {
        const post = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(post);

        await callForHelpPostsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusBeforeToggle } = await callForHelpPostsManager.getById({ postId });

        await callForHelpPostsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusAfterToggle } = await callForHelpPostsManager.getById({ postId });

        expect(statusBeforeToggle).to.equal('DISABLED');
        expect(statusAfterToggle).to.equal('ENABLED');
    });

    it('given a toggle call for help enabling status request, after updating the post status, then should return the updated post status', async () => {
        const post = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(post);

        const { status } = await callForHelpPostsManager.toggleEnablingStatus({
            postId,
            userId: post.publisherId,
        });

        const updated = await callForHelpPostsManager.getById({ postId });

        expect(status).to.deep.equal(updated.status);
    });
});
