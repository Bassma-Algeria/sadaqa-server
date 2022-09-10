import { UseCase } from '../../UseCase';
import { SendTextMessageUseCaseRequest } from './SendTextMessageUseCaseRequest';
import { SendTextMessageUseCaseResponse } from './SendTextMessageUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { TextMessage } from '../../../domain/TextMessage';
import { TextMessageContent } from '../../../domain/TextMessageContent';

import { UsersService } from '../../../domain/services/UsersService';
import { MessageIdGenerator } from '../../../domain/services/MessageIdGenerator';
import { TextMessageRepository } from '../../../domain/services/MessageRepository/TextMessageRepository';
import { TextMessageEventPublisher } from '../../../domain/services/MessageEventPublisher/TextMessageEventPublisher';

import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../domain/exceptions/ValidationException';

class SendTextMessageUseCase
    implements UseCase<SendTextMessageUseCaseRequest, SendTextMessageUseCaseResponse>
{
    constructor(
        private readonly usersService: UsersService,
        private readonly messageIdGenerator: MessageIdGenerator,
        private readonly textMessageRepository: TextMessageRepository,
        private readonly textMessageEventPublisher: TextMessageEventPublisher,
    ) {}

    async handle(request: SendTextMessageUseCaseRequest): Promise<SendTextMessageUseCaseResponse> {
        const senderId = new UserId(request.senderId);
        const receiverId = new UserId(request.receiverId);
        const content = new TextMessageContent(request.message);

        await this.checkSenderExistenceThrowIfNotExist(senderId);
        await this.checkReceiverExistenceThrowIfNotExist(receiverId);

        const message = TextMessage.aBuilder()
            .withMessageId(this.getMessageId())
            .withContent(content)
            .withSenderId(senderId)
            .withReceiverId(receiverId)
            .withReadStatus(false)
            .withCreatedAt(this.now())
            .build();

        await this.saveMessage(message);

        this.publishMessageSentEvent(message);

        return { messageId: message.messageId.value() };
    }

    private async checkSenderExistenceThrowIfNotExist(senderId: UserId) {
        if (!(await this.usersService.isExist(senderId)))
            throw new ValidationException(ExceptionMessages.SENDER_NOT_EXIST);
    }

    private async checkReceiverExistenceThrowIfNotExist(receiverId: UserId) {
        if (!(await this.usersService.isExist(receiverId)))
            throw new ValidationException(ExceptionMessages.RECEIVER_NOT_EXIST);
    }

    private getMessageId() {
        return this.messageIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }

    private async saveMessage(message: TextMessage) {
        await this.textMessageRepository.save(message);
    }

    private publishMessageSentEvent(message: TextMessage) {
        this.textMessageEventPublisher.publishMessageSent(message);
    }
}

export { SendTextMessageUseCase };