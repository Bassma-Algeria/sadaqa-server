import { UseCase } from '../../../UseCase';
import { CreateNewCallForHelpPostNotificationUseCaseRequest } from './CreateNewCallForHelpPostNotificationUseCaseRequest';

import { PostId } from '../../../../domain/PostId';
import { UserId } from '../../../../domain/UserId';
import { PostNotificationReason } from '../../../../domain/PostNotificationReason';
import { CallForHelpPostNotification } from '../../../../domain/CallForHelpPostNotification';
import { CallForHelpPostNotificationBuilder } from '../../../../domain/CallForHelpPostNotificationBuilder';

import { UsersService } from '../../../../domain/services/UsersService';
import { NotificationIdGenerator } from '../../../../domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from '../../../../domain/services/NotificationEventPublisher';
import { CallForHelpPostNotificationRepository } from '../../../../domain/services/repositories/CallForHelpPostNotificationRepository';

class CreateNewCallForHelpPostNotificationUseCase
    implements UseCase<CreateNewCallForHelpPostNotificationUseCaseRequest, void>
{
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly postNotificationRepository: CallForHelpPostNotificationRepository,
    ) {}

    async handle(request: CreateNewCallForHelpPostNotificationUseCaseRequest): Promise<void> {
        const { postId, wilayaNumber, publisherId } = this.getFrom(request);

        const usersInSameWilaya = await this.getIdsOfUsersInWilaya(wilayaNumber).exclude([
            publisherId,
        ]);

        const notificationBuilder = CallForHelpPostNotification.aBuilder()
            .withPostId(postId)
            .withClicked(false)
            .withRead(false);

        for (const userId of usersInSameWilaya)
            await this.createNotificationForUserInSameWilaya(notificationBuilder, userId);
    }

    private getFrom(request: CreateNewCallForHelpPostNotificationUseCaseRequest) {
        const postId = new PostId(request.postId);
        const publisherId = new UserId(request.publisherId);
        const wilayaNumber = request.wilayaNumber;

        return { postId, wilayaNumber, publisherId };
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

    private async createNotificationForUserInSameWilaya(
        notificationBuilder: CallForHelpPostNotificationBuilder,
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

    private async saveNotification(notification: CallForHelpPostNotification) {
        await this.postNotificationRepository.save(notification);
    }

    private publishNewDonationRequestPostNotificationCreatedEvent(
        notification: CallForHelpPostNotification,
    ) {
        this.notificationEventPublisher.newCallForHelpPostNotificationCreated(notification);
    }
}

export { CreateNewCallForHelpPostNotificationUseCase };