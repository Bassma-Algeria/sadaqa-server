import { UseCase } from '../UseCase';
import { GetConversationUseCaseRequest } from './GetConversationUseCaseRequest';
import { GetConversationUseCaseResponse } from './GetConversationUseCaseResponse';

import { UserId } from '../../domain/UserId';

import { TextMessageRepository } from '../../domain/services/MessageRepository/TextMessageRepository';
import { MessageRepositoryFindManyFilters } from '../../domain/services/MessageRepository/base/MessageRepository';

import { TextMessageDtoMapper } from '../_common_/dtos/TextMessageDtoMapper';

class GetConversationUseCase
    implements UseCase<GetConversationUseCaseRequest, GetConversationUseCaseResponse>
{
    private readonly PAGE_LIMIT = 20;

    constructor(private readonly textMessageRepository: TextMessageRepository) {}

    async handle(request: GetConversationUseCaseRequest): Promise<GetConversationUseCaseResponse> {
        const filters = this.getFiltersFrom(request);

        const textMessages = await this.textMessageRepository.findMany(filters);
        const totalTextMessages = await this.textMessageRepository.count(filters);

        return {
            messages: textMessages.map(TextMessageDtoMapper.toDto),
            end: this.isEndPage(filters.page, totalTextMessages),
            page: filters.page,
            total: totalTextMessages,
        };
    }

    getFiltersFrom(request: GetConversationUseCaseRequest): MessageRepositoryFindManyFilters {
        const firstChatParticipant = new UserId(request.between);
        const secondChatParticipant = new UserId(request.and);
        const page = request.page || 1;

        return {
            between: firstChatParticipant,
            and: secondChatParticipant,
            pageLimit: this.PAGE_LIMIT,
            page,
        };
    }

    isEndPage(page: number, total: number) {
        return page * this.PAGE_LIMIT >= total;
    }
}

export { GetConversationUseCase };