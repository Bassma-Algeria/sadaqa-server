import { UseCase } from '../UseCase';
import { MakeNotificationReadUseCaseRequest } from './MakeNotificationReadUseCaseRequest';

import { UserId } from '../../domain/UserId';
import { Notification } from '../../domain/Notification';
import { NotificationId } from '../../domain/NotificationId';

import { NotificationEventPublisher } from '../../domain/services/NotificationEventPublisher';
import { NotificationRepository } from '../../domain/services/repositories/base/NotificationRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../domain/exceptions/AuthorizationException';

class MakeNotificationReadUseCase implements UseCase<MakeNotificationReadUseCaseRequest, void> {
    constructor(
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly textMessageNotificationRepository: NotificationRepository<Notification>,
    ) {}

    async handle(request: MakeNotificationReadUseCaseRequest): Promise<void> {
        const { notificationId, userId } = this.getFrom(request);

        const notification = await this.findNotificationByIdThrowIfNotFound(notificationId);

        this.checkIfRequesterIsNotifictionReceiverThrowIfNot(notification, userId);

        const updatedNotification = notification.makeRead();

        await this.updateNotification(updatedNotification);

        this.notificationEventPublisher.notificationRead(updatedNotification);
    }

    private getFrom(request: MakeNotificationReadUseCaseRequest) {
        const userId = new UserId(request.userId);
        const notificationId = new NotificationId(request.notificationId);

        return { notificationId, userId };
    }

    private async findNotificationByIdThrowIfNotFound(id: NotificationId) {
        const notification = await this.textMessageNotificationRepository.findById(id);

        if (!notification) throw new NotFoundException(ExceptionMessages.NOTIFICATION_NOT_FOUND);

        return notification;
    }

    private checkIfRequesterIsNotifictionReceiverThrowIfNot(
        notification: Notification,
        userId: UserId,
    ) {
        if (!notification.receiverId.equals(userId))
            throw new AuthorizationException(
                ExceptionMessages.YOUR_ARE_NOT_THE_NOTIFICATION_RECEIVER,
            );
    }

    private async updateNotification(notification: Notification) {
        await this.textMessageNotificationRepository.update(notification);
    }
}

export { MakeNotificationReadUseCase };
