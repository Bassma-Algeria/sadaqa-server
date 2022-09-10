import { v4 as uuidv4 } from 'uuid';

import { MessageId } from '../../core/domain/MessageId';
import { MessageIdGenerator } from '../../core/domain/services/MessageIdGenerator';

class UuidMessageIdGenerator implements MessageIdGenerator {
    nextId(): MessageId {
        return new MessageId(uuidv4());
    }
}

export { UuidMessageIdGenerator };