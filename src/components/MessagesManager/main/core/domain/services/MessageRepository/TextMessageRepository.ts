import { MessageRepository } from './base/MessageRepository';

import { TextMessage } from '../../TextMessage';

export type TextMessageRepository = MessageRepository<TextMessage>;