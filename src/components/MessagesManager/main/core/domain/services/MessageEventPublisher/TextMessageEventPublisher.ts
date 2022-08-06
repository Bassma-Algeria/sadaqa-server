import { TextMessage } from '../../TextMessage';
import { MessageEventPublisher } from './base/MessageEventPublisher';

export interface TextMessageEventPublisher extends MessageEventPublisher<TextMessage> {}