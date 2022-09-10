import { UseCase } from '../UseCase';
import { MakeNotificationClickedUseCaseRequest } from './MakeNotificationClickedUseCaseRequest';

import { UserId } from '../../domain/UserId';
import { Notification } from '../../domain/Notification';
import { NotificationId } from '../../domain/NotificationId';

import { NotificationEventPublisher } from '../../domain/services/NotificationEventPublisher';
import { NotificationRepository } from '../../domain/services/repositories/base/NotificationRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../domain/exceptions/ValidationException';
import { AuthorizationException } from '../../domain/exceptions/AuthorizationException';

class MakeNotificationClickedUseCase
    implements UseCase<MakeNotificationClickedUseCaseRequest, void>
{
    constructor(
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly textMessageNotificationRepository: NotificationRepository<Notification>,
    ) {}

    async handle(request: MakeNotificationClickedUseCaseRequest): Promise<void> {
        const { notificationId, userId } = this.getFrom(request);

        const notification = await this.findNotificationByIdThrowIfNotFound(notificationId);

        this.checkIfRequesterIsNotifictionReceiverThrowIfNot(notification, userId);
        await this.checkIfNotificationAlreadyClickedThrowIfSo(notification);

        const updatedNotification = notification.makeClicked();

        await this.updateNotification(updatedNotification);

        this.notificationEventPublisher.notificationClicked(updatedNotification);
    }

    private getFrom(request: MakeNotificationClickedUseCaseRequest) {
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

    private async checkIfNotificationAlreadyClickedThrowIfSo(notification: Notification) {
        if (notification.clicked)
            throw new ValidationException(ExceptionMessages.NOTIFICATION_ALREADY_CLICKED);
    }

    private async updateNotification(notification: Notification) {
        await this.textMessageNotificationRepository.update(notification);
    }
}

export { MakeNotificationClickedUseCase };
