import { UseCase } from '../../../UseCase';
import { CreateNewFamilyInNeedPostNotificationUseCaseRequest } from './CreateNewFamilyInNeedPostNotificationUseCaseRequest';

import { PostId } from '../../../../domain/PostId';
import { UserId } from '../../../../domain/UserId';
import { PostNotificationReason } from '../../../../domain/PostNotificationReason';
import { FamilyInNeedPostNotification } from '../../../../domain/FamilyInNeedPostNotification';

import { UsersService } from '../../../../domain/services/UsersService';
import { NotificationIdGenerator } from '../../../../domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from '../../../../domain/services/NotificationEventPublisher';
import { FamilyInNeedPostNotificationRepository } from '../../../../domain/services/repositories/FamilyInNeedPostNotificationRepository';
import { FamilyInNeedPostNotificationBuilder } from '../../../../domain/FamilyInNeedPostNotificationBuilder';

class CreateNewFamilyInNeedPostNotificationUseCase
    implements UseCase<CreateNewFamilyInNeedPostNotificationUseCaseRequest, void>
{
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly postNotificationRepository: FamilyInNeedPostNotificationRepository,
    ) {}

    async handle(request: CreateNewFamilyInNeedPostNotificationUseCaseRequest): Promise<void> {
        const { postId, wilayaNumber, publisherId } = this.getFrom(request);

        const usersInSameWilaya = await this.getIdsOfUsersInWilaya(wilayaNumber).exclude([
            publisherId,
        ]);

        const notificationBuilder = FamilyInNeedPostNotification.aBuilder()
            .withPostId(postId)
            .withClicked(false)
            .withRead(false);

        for (const userId of usersInSameWilaya)
            await this.createNotificationForUserInSameWilaya(notificationBuilder, userId);
    }

    private getFrom(request: CreateNewFamilyInNeedPostNotificationUseCaseRequest) {
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
        notificationBuilder: FamilyInNeedPostNotificationBuilder,
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

    private async saveNotification(notification: FamilyInNeedPostNotification) {
        await this.postNotificationRepository.save(notification);
    }

    private publishNewDonationRequestPostNotificationCreatedEvent(
        notification: FamilyInNeedPostNotification,
    ) {
        this.notificationEventPublisher.newFamilyInNeedPostNotificationCreated(notification);
    }
}

export { CreateNewFamilyInNeedPostNotificationUseCase };