import { UseCase } from '../UseCase';
import { MakeMessageReadUseCaseRequest } from './MakeMessageReadUseCaseRequest';

import { UserId } from '../../domain/UserId';
import { MessageId } from '../../domain/MessageId';
import { TextMessage } from '../../domain/TextMessage';

import { TextMessageRepository } from '../../domain/services/MessageRepository/TextMessageRepository';
import { TextMessageEventPublisher } from '../../domain/services/MessageEventPublisher/TextMessageEventPublisher';

import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ValidationException } from '../../domain/exceptions/ValidationException';

class MakeMessageReadUseCase implements UseCase<MakeMessageReadUseCaseRequest, void> {
    constructor(
        private readonly textMessageRepository: TextMessageRepository,
        private readonly textMessageEventPublisher: TextMessageEventPublisher,
    ) {}

    async handle(request: MakeMessageReadUseCaseRequest): Promise<void> {
        const requesterId = new UserId(request.userId);
        const messageId = new MessageId(request.messageId);

        const message = await this.findMessageByIdThrowIfNotFound(messageId);

        this.checkIfRequesterIsReceiverThrowIfNot(message, requesterId);
        this.checkIfMessageIsReadThrowIfSo(message);

        const readMessage = message.makeRead();

        await this.updateMessage(readMessage);
        await this.publishMessageReadEvent(readMessage);
    }

    private checkIfMessageIsReadThrowIfSo(message: TextMessage) {
        if (message.read) throw new ValidationException(ExceptionMessages.MESSAGE_ALREADY_READ);
    }

    private checkIfRequesterIsReceiverThrowIfNot(message: TextMessage, userId: UserId) {
        if (!message.receiverId.equals(userId))
            throw new ValidationException(ExceptionMessages.ONLY_MESSAGE_RECEIVER_CAN_MAKE_IT_READ);
    }

    private async findMessageByIdThrowIfNotFound(messageId: MessageId) {
        const message = await this.textMessageRepository.findById(messageId);

        if (!message) throw new NotFoundException(ExceptionMessages.MESSAGE_NOT_FOUND);
        return message;
    }

    private async updateMessage(message: TextMessage) {
        await this.textMessageRepository.update(message);
    }

    private publishMessageReadEvent(message: TextMessage) {
        this.textMessageEventPublisher.publishMessageRead(message);
    }
}

export { MakeMessageReadUseCase };