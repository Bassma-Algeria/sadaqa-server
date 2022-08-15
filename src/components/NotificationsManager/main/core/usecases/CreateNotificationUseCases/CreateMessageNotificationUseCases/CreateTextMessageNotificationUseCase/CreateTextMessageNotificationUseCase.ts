import { UseCase } from '../../../UseCase';
import { CreateTextMessageNotificationUseCaseRequest } from './CreateTextMessageNotificationUseCaseRequest';

import { UserId } from '../../../../domain/UserId';
import { TextMessageNotification } from '../../../../domain/TextMessageNotification';

import { NotificationIdGenerator } from '../../../../domain/services/NotificationIdGenerator';
import { TextMessageNotificationRepository } from '../../../../domain/services/repositories/TextMessageNotificationRepository';
import { NotificationEventPublisher } from '../../../../domain/services/NotificationEventPublisher';

class CreateTextMessageNotificationUseCase
    implements UseCase<CreateTextMessageNotificationUseCaseRequest, void>
{
    constructor(
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly textMessageNotificationRepository: TextMessageNotificationRepository,
    ) {}

    async handle(request: CreateTextMessageNotificationUseCaseRequest): Promise<void> {
        const { messageContent, messageReceiverId, messageSenderId } = this.getFrom(request);

        const notification = TextMessageNotification.aBuilder()
            .withId(this.getRandomId())
            .withReceiverId(messageReceiverId)
            .withMessageContent(messageContent)
            .withMessageSenderId(messageSenderId)
            .withRead(false)
            .withClicked(false)
            .withCreatedAt(this.now())
            .build();

        await this.textMessageNotificationRepository.save(notification);
        this.notificationEventPublisher.newTextMessageNotificationCreated(notification);
    }

    private getFrom(request: CreateTextMessageNotificationUseCaseRequest) {
        const messageContent = request.content;
        const messageSenderId = new UserId(request.senderId);
        const messageReceiverId = new UserId(request.receiverId);

        return { messageContent, messageSenderId, messageReceiverId };
    }

    private getRandomId() {
        return this.notificationIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }
}

export { CreateTextMessageNotificationUseCase };
