import { NotificationRepository } from './base/NotificationRepository';
import { TextMessageNotification } from '../../TextMessageNotification';

export interface TextMessageNotificationRepository
    extends NotificationRepository<TextMessageNotification> {}
