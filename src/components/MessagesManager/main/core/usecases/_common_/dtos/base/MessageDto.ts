import { MessageType } from '../../../../domain/MessageType';

export interface MessageDto {
    readonly type: MessageType;
    readonly message: {
        readonly messageId: string;
        readonly senderId: string;
        readonly receiverId: string;
        readonly read: boolean;
        readonly createdAt: Date;
    };
}