import { UseCase } from '../UseCase';
import { GetUnreadMessagesNumberUseCaseRequest } from './GetUnreadMessagesNumberUseCaseRequest';
import { GetUnreadMessagesNumberUseCaseResponse } from './GetUnreadMessagesNumberUseCaseResponse';

import { UserId } from '../../domain/UserId';

import { TextMessageRepository } from '../../domain/services/MessageRepository/TextMessageRepository';

class GetUnreadMessagesNumberUseCase
    implements
        UseCase<GetUnreadMessagesNumberUseCaseRequest, GetUnreadMessagesNumberUseCaseResponse>
{
    constructor(private readonly textMessageMessageRepository: TextMessageRepository) {}

    async handle(
        request: GetUnreadMessagesNumberUseCaseRequest,
    ): Promise<GetUnreadMessagesNumberUseCaseResponse> {
        const receiverId = new UserId(request.receiverId);

        const unreadTextMessages = await this.textMessageMessageRepository.countPerReceiver({
            receiverId,
            read: false,
        });

        return { total: unreadTextMessages };
    }
}

export { GetUnreadMessagesNumberUseCase };
