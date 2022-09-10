import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aDonationPostsManager } from '../base/aDonationPostsManager';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';
import { aTogglePostEnablingStatusRequest } from '../base/requests/aTogglePostEnablingStatusRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';

describe('Toggle Donation Post Enabling Status', () => {
    const postsManager = aDonationPostsManager();

    it('given a toggle donation post enabling status request, when the postId not exist, should throw a not found exception', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            postsManager.toggleEnablingStatus(
                aTogglePostEnablingStatusRequest({ postId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a toggle donation post enabling status request, when the userId is not the publisher, should throw a not authorized exception', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await postsManager.create(aDonationPostCreationRequest());

        await expect(
            postsManager.toggleEnablingStatus(
                aTogglePostEnablingStatusRequest({ postId, userId: NOT_PUBLISHER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_EDIT)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a toggle donation post enabling status request, when the userId is the publisher and the post is enabled, should make it disabled', async () => {
        const post = aDonationPostCreationRequest();
        const { postId } = await postsManager.create(post);

        const { status: statusBeforeToggle } = await postsManager.getById({ postId });

        await postsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusAfterToggle } = await postsManager.getById({ postId });

        expect(statusBeforeToggle).to.equal('ENABLED');
        expect(statusAfterToggle).to.equal('DISABLED');
    });

    it('given a toggle donation post enabling status request, when the userId is the publisher and the post is disabled, should make it enabled', async () => {
        const post = aDonationPostCreationRequest();
        const { postId } = await postsManager.create(post);

        await postsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusBeforeToggle } = await postsManager.getById({ postId });

        await postsManager.toggleEnablingStatus({ postId, userId: post.publisherId });

        const { status: statusAfterToggle } = await postsManager.getById({ postId });

        expect(statusBeforeToggle).to.equal('DISABLED');
        expect(statusAfterToggle).to.equal('ENABLED');
    });

    it('given a toggle donation post enabling status request, after updating the post status, then should return the updated post status', async () => {
        const post = aDonationPostCreationRequest();
        const { postId } = await postsManager.create(post);

        const { status } = await postsManager.toggleEnablingStatus({
            postId,
            userId: post.publisherId,
        });

        const updated = await postsManager.getById({ postId });

        expect(status).to.deep.equal(updated.status);
    });
});
