import { TextMessageDto } from '../_common_/dtos/TextMessageDto';

export interface GetConversationUseCaseResponse {
    messages: Array<TextMessageDto>;
    end: boolean;
    total: number;
    page: number;
}