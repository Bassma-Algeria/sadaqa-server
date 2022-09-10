const ExceptionMessages = {
    SENDER_NOT_EXIST: 'sender not exist',
    RECEIVER_NOT_EXIST: 'receiver not exist',
    TEXT_MESSAGE_CONTENT_CANNOT_BE_EMPTY: 'text message content can not be empty',
    EMPTY_MESSAGE_ID: 'empty messageId',
    ONLY_MESSAGE_RECEIVER_CAN_MAKE_IT_READ: 'only the receiver can make the message read',
    MESSAGE_NOT_FOUND: 'message not found',
    MESSAGE_ALREADY_READ: 'message already read',
} as const;

export { ExceptionMessages };