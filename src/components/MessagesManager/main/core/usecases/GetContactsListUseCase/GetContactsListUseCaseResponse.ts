import { TextMessageDto } from '../_common_/dtos/TextMessageDto';

export interface GetContactsListUseCaseResponse {
    readonly contacts: {
        readonly userId: string;
        readonly latestMessage: TextMessageDto;
    }[];
}