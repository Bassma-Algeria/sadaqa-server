import { UseCase } from '../UseCase';
import { GetContactsListUseCaseRequest } from './GetContactsListUseCaseRequest';
import { GetContactsListUseCaseResponse } from './GetContactsListUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { TextMessage } from '../../domain/TextMessage';

import { TextMessageRepository } from '../../domain/services/MessageRepository/TextMessageRepository';

import { TextMessageDtoMapper } from '../_common_/dtos/TextMessageDtoMapper';

class GetContactsListUseCase
    implements UseCase<GetContactsListUseCaseRequest, GetContactsListUseCaseResponse>
{
    constructor(private readonly textMessageRepository: TextMessageRepository) {}

    async handle(request: GetContactsListUseCaseRequest): Promise<GetContactsListUseCaseResponse> {
        const userId = new UserId(request.userId);

        const textMessages = await this.textMessageRepository.findLatestMessagesWithEveryUser(
            userId,
        );

        return {
            contacts: textMessages.map(message => ({
                userId: this.getContactId(message, userId),
                latestMessage: TextMessageDtoMapper.toDto(message),
            })),
        };
    }

    private getContactId(message: TextMessage, userId: UserId) {
        return message.senderId.equals(userId)
            ? message.receiverId.value()
            : message.senderId.value();
    }
}

export { GetContactsListUseCase };