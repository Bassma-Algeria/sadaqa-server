import { Message } from '../../../../domain/Message';

class MessageDtoMapper {
    static toDto(message: Message) {
        return {
            messageId: message.messageId.value(),
            receiverId: message.receiverId.value(),
            senderId: message.senderId.value(),
            read: message.read,
            createdAt: message.createdAt,
        };
    }
}

export { MessageDtoMapper };