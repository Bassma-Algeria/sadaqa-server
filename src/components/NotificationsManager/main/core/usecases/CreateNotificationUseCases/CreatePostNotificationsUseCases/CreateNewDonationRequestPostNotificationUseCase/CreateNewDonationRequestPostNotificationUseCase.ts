import { UseCase } from '../../../UseCase';
import { CreateNewDonationRequestPostNotificationUseCaseRequest } from './CreateNewDonationRequestPostNotificationUseCaseRequest';

import { PostId } from '../../../../domain/PostId';
import { UserId } from '../../../../domain/UserId';
import { PostTokens } from '../../../../domain/PostTokens';
import { PostNotificationReason } from '../../../../domain/PostNotificationReason';
import { DonationRequestPostNotification } from '../../../../domain/DonationRequestPostNotification';
import { DonationRequestPostNotificationBuilder } from '../../../../domain/DonationRequestPostNotificationBuilder';

import { PostsService } from '../../../../domain/services/PostsService';
import { UsersService } from '../../../../domain/services/UsersService';
import { NotificationIdGenerator } from '../../../../domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from '../../../../domain/services/NotificationEventPublisher';
import { DonationRequestPostNotificationRepository } from '../../../../domain/services/repositories/DonationRequestPostNotificationRepository';

class CreateNewDonationRequestPostNotificationUseCase
    implements UseCase<CreateNewDonationRequestPostNotificationUseCaseRequest, void>
{
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly postNotificationRepository: DonationRequestPostNotificationRepository,
    ) {}

    async handle(request: CreateNewDonationRequestPostNotificationUseCaseRequest): Promise<void> {
        const { postId, wilayaNumber, publisherId, postTokens } = this.getFrom(request);

        const donationPublishers = await this.getPublishersOfDonationsThatMatches(
            postTokens,
        ).exclude([publisherId]);

        const usersInSameWilaya = await this.getIdsOfUsersInWilaya(wilayaNumber).exclude([
            ...donationPublishers,
            publisherId,
        ]);

        const notificationBuilder = DonationRequestPostNotification.aBuilder()
            .withPostId(postId)
            .withClicked(false)
            .withRead(false);

        for (const userId of usersInSameWilaya)
            await this.createNotificationForUserInSameWilaya(notificationBuilder, userId);

        for (const donationPublisherId of donationPublishers)
            await this.createNotificationForDonationPublisher(
                notificationBuilder,
                donationPublisherId,
            );
    }

    private getFrom(request: CreateNewDonationRequestPostNotificationUseCaseRequest) {
        const postId = new PostId(request.postId);
        const publisherId = new UserId(request.publisherId);
        const postTokens = new PostTokens(request.title);
        const wilayaNumber = request.wilayaNumber;

        return { postId, wilayaNumber, publisherId, postTokens };
    }

    private getPublishersOfDonationsThatMatches(tokens: PostTokens) {
        return {
            exclude: async (ids: UserId[]) => {
                const publisherIds = await this.postsService.getPublishersOfDonationsThatMatch(
                    tokens,
                );

                return publisherIds.filter((publisherId, index, self) => {
                    const excluded = ids.find(id => publisherId.equals(id));
                    const isUnique = index === self.findIndex(id => id.equals(publisherId));

                    return !excluded && isUnique;
                });
            },
        };
    }

    private getIdsOfUsersInWilaya(wilayaNumber: number) {
        return {
            exclude: async (ids: UserId[]) => {
                const usersIds = await this.usersService.getIdsOfUsersInWilaya(wilayaNumber);

                return usersIds.filter(userId => {
                    const excluded = ids.find(id => userId.equals(id));

                    return !excluded;
                });
            },
        };
    }

    private async createNotificationForDonationPublisher(
        notificationBuilder: DonationRequestPostNotificationBuilder,
        donationRequestsPublisherId: UserId,
    ) {
        const notification = notificationBuilder
            .withId(this.generateId())
            .withReceiverId(donationRequestsPublisherId)
            .withReason(PostNotificationReason.LIKELY_HAVING_SIMILAR_DONATION)
            .withCreatedAt(this.now())
            .build();

        await this.saveNotification(notification);
        this.publishNewDonationRequestPostNotificationCreatedEvent(notification);
    }

    private async createNotificationForUserInSameWilaya(
        notificationBuilder: DonationRequestPostNotificationBuilder,
        userId: UserId,
    ) {
        const notification = notificationBuilder
            .withId(this.generateId())
            .withReceiverId(userId)
            .withReason(PostNotificationReason.POST_IN_RECEIVER_WILAYA)
            .withCreatedAt(this.now())
            .build();

        await this.saveNotification(notification);
        this.publishNewDonationRequestPostNotificationCreatedEvent(notification);
    }

    private generateId() {
        return this.notificationIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }

    private async saveNotification(notification: DonationRequestPostNotification) {
        await this.postNotificationRepository.save(notification);
    }

    private publishNewDonationRequestPostNotificationCreatedEvent(
        notification: DonationRequestPostNotification,
    ) {
        this.notificationEventPublisher.newDonationRequestPostNotificationCreated(notification);
    }
}

export { CreateNewDonationRequestPostNotificationUseCase };