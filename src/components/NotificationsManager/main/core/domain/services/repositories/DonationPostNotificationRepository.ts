import { DonationPostNotification } from '../../DonationPostNotification';

import { NotificationRepository } from './base/NotificationRepository';

export interface DonationPostNotificationRepository
    extends NotificationRepository<DonationPostNotification> {}
