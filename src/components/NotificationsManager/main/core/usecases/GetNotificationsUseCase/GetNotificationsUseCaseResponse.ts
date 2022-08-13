import { DonationPostNotificationDto } from '../_common_/dtos/DonationPostNotificationDto';
import { CallForHelpPostNotificationDto } from '../_common_/dtos/CallForHelpPostNotificationDto';
import { FamilyInNeedPostNotificationDto } from '../_common_/dtos/FamilyInNeedPostNotificationDto';
import { DonationRequestPostNotificationDto } from '../_common_/dtos/DonationRequestPostNotificationDto';

export interface GetNotificationsUseCaseResponse {
    total: number;
    page: number;
    end: boolean;
    list: (
        | DonationPostNotificationDto
        | DonationRequestPostNotificationDto
        | FamilyInNeedPostNotificationDto
        | CallForHelpPostNotificationDto
    )[];
}