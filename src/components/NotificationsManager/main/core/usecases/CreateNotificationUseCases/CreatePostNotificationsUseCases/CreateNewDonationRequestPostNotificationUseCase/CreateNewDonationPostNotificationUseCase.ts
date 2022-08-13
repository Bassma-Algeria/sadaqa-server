import { UseCase } from '../../../UseCase';
import { CreateNewDonationPostNotificationUseCaseRequest } from './CreateNewDonationPostNotificationUseCaseRequest';

import { PostId } from '../../../../domain/PostId';
import { UserId } from '../../../../domain/UserId';
import { PostTokens } from '../../../../domain/PostTokens';
import { DonationPostNotification } from '../../../../domain/DonationPostNotification';
import { DonationPostNotificationReason } from '../../../../domain/DonationPostNotificationReason';
import { DonationPostNotificationBuilder } from '../../../../domain/DonationPostNotificationBuilder';

import { PostsService } from '../../../../domain/services/PostsService';
import { UsersService } from '../../../../domain/services/UsersService';
import { NotificationIdGenerator } from '../../../../domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from '../../../../domain/services/NotificationEventPublisher';
import { DonationPostNotificationRepository } from '../../../../domain/services/repositories/DonationPostNotificationRepository';

class CreateNewDonationPostNotificationUseCase
    implements UseCase<CreateNewDonationPostNotificationUseCaseRequest, void>
{
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly postNotificationRepository: DonationPostNotificationRepository,
    ) {}

    async handle(request: CreateNewDonationPostNotificationUseCaseRequest): Promise<void> {
        const { postId, wilayaNumber, publisherId, postTokens } = this.getFrom(request);

        const donationRequestsPublishers = await this.getPublishersOfDonationRequestsThatMatches(
            postTokens,
        ).exclude([publisherId]);

        const associationsInSameWilaya = await this.getIdsOfAssociationsInWilaya(
            wilayaNumber,
        ).exclude([...donationRequestsPublishers, publisherId]);

        const notificationBuilder = DonationPostNotification.aBuilder()
            .withPostId(postId)
            .withClicked(false)
            .withRead(false);

        for (const associationId of associationsInSameWilaya)
            await this.createNotificationForAssociation(notificationBuilder, associationId);

        for (const donationRequestsPublisherId of donationRequestsPublishers)
            await this.createNotificationForDonationRequestPublisher(
                notificationBuilder,
                donationRequestsPublisherId,
            );
    }

    private getFrom(request: CreateNewDonationPostNotificationUseCaseRequest) {
        const postId = new PostId(request.postId);
        const publisherId = new UserId(request.publisherId);
        const postTokens = new PostTokens(request.title);
        const wilayaNumber = request.wilayaNumber;

        return { postId, wilayaNumber, publisherId, postTokens };
    }

    private getPublishersOfDonationRequestsThatMatches(tokens: PostTokens) {
        return {
            exclude: async (ids: UserId[]) => {
                const publisherIds =
                    await this.postsService.getPublishersOfDonationRequestsThatMatch(tokens);

                return publisherIds.filter((publisherId, index, self) => {
                    const excluded = ids.find(id => publisherId.equals(id));
                    const isUnique = index === self.findIndex(id => id.equals(publisherId));

                    return !excluded && isUnique;
                });
            },
        };
    }

    private getIdsOfAssociationsInWilaya(wilayaNumber: number) {
        return {
            exclude: async (ids: UserId[]) => {
                const associationsIds = await this.usersService.getIdsOfAssociationsInWilaya(
                    wilayaNumber,
                );

                return associationsIds.filter(associationId => {
                    const excluded = ids.find(id => associationId.equals(id));

                    return !excluded;
                });
            },
        };
    }

    private async createNotificationForDonationRequestPublisher(
        notificationBuilder: DonationPostNotificationBuilder,
        donationRequestsPublisherId: UserId,
    ) {
        const notification = notificationBuilder
            .withId(this.generateId())
            .withReceiverId(donationRequestsPublisherId)
            .withReason(DonationPostNotificationReason.LIKELY_HAVING_SIMILAR_DONATION_REQUEST)
            .withCreatedAt(this.now())
            .build();

        await this.saveNotification(notification);
        this.publishNewDonationPostNotificationCreatedEvent(notification);
    }

    private async createNotificationForAssociation(
        notificationBuilder: DonationPostNotificationBuilder,
        associationId: UserId,
    ) {
        const notification = notificationBuilder
            .withId(this.generateId())
            .withReceiverId(associationId)
            .withReason(DonationPostNotificationReason.POST_IN_RECEIVER_WILAYA)
            .withCreatedAt(this.now())
            .build();

        await this.saveNotification(notification);
        this.publishNewDonationPostNotificationCreatedEvent(notification);
    }

    private generateId() {
        return this.notificationIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }

    private async saveNotification(notification: DonationPostNotification) {
        await this.postNotificationRepository.save(notification);
    }

    private publishNewDonationPostNotificationCreatedEvent(notification: DonationPostNotification) {
        this.notificationEventPublisher.newDonationPostNotificationCreated(notification);
    }
}

export { CreateNewDonationPostNotificationUseCase };