import { MessageDto } from './base/MessageDto';
import { MessageType } from '../../../domain/MessageType';

export interface TextMessageDto extends MessageDto {
    readonly type: MessageType.TEXT;
    readonly message: MessageDto['message'] & {
        readonly content: string;
    };
}