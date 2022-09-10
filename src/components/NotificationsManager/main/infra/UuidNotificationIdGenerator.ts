import { v4 as uuidv4 } from 'uuid';

import { NotificationId } from '../core/domain/NotificationId';
import { NotificationIdGenerator } from '../core/domain/services/NotificationIdGenerator';

class UuidNotificationIdGenerator implements NotificationIdGenerator {
    nextId(): NotificationId {
        return new NotificationId(uuidv4());
    }
}

export { UuidNotificationIdGenerator };