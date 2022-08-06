import { TextMessage } from '../../../domain/TextMessage';

import { TextMessageDto } from './TextMessageDto';
import { MessageDtoMapper } from './base/MessageDtoMapper';

import { MessageType } from '../../../domain/MessageType';

class TextMessageDtoMapper {
    static toDto(message: TextMessage): TextMessageDto {
        return {
            type: MessageType.TEXT,
            message: {
                ...MessageDtoMapper.toDto(message),

                content: message.content.value(),
            },
        };
    }
}

export { TextMessageDtoMapper };