import { UseCase } from '../UseCase';
import { GetNumberOfUnreadNotificationsUseCaseRequest } from './GetNumberOfUnreadNotificationsUseCaseRequest';
import { GetNumberOfUnreadNotificationsUseCaseResponse } from './GetNumberOfUnreadNotificationsUseCaseResponse';

import { CallForHelpPostNotificationRepository } from '../../domain/services/repositories/CallForHelpPostNotificationRepository';
import { UserId } from '../../domain/UserId';
import { DonationPostNotificationRepository } from '../../domain/services/repositories/DonationPostNotificationRepository';
import { DonationRequestPostNotificationRepository } from '../../domain/services/repositories/DonationRequestPostNotificationRepository';
import { FamilyInNeedPostNotificationRepository } from '../../domain/services/repositories/FamilyInNeedPostNotificationRepository';
import { TextMessageNotificationRepository } from '../../domain/services/repositories/TextMessageNotificationRepository';

class GetNumberOfUnreadNotificationsUseCase
    implements
        UseCase<
            GetNumberOfUnreadNotificationsUseCaseRequest,
            GetNumberOfUnreadNotificationsUseCaseResponse
        >
{
    constructor(
        private readonly textMessageNotificationRepository: TextMessageNotificationRepository,
        private readonly donationPostNotificationRepository: DonationPostNotificationRepository,
        private readonly callForHelpPostNotificationRepository: CallForHelpPostNotificationRepository,
        private readonly familyInNeedPostNotificationRepository: FamilyInNeedPostNotificationRepository,
        private readonly donationRequestPostNotificationRepository: DonationRequestPostNotificationRepository,
    ) {}

    async handle(
        request: GetNumberOfUnreadNotificationsUseCaseRequest,
    ): Promise<GetNumberOfUnreadNotificationsUseCaseResponse> {
        const receiverId = new UserId(request.receiverId);
        const filters = { receiverId, read: false };

        const unreadCallForHelpNotifications =
            await this.callForHelpPostNotificationRepository.count(filters);

        const unreadDonationNotifications = await this.donationPostNotificationRepository.count(
            filters,
        );

        const unreadDonationRequestNotifications =
            await this.donationRequestPostNotificationRepository.count(filters);

        const unreadFamilyInNeedNotifications =
            await this.familyInNeedPostNotificationRepository.count(filters);

        const unreadTextMessageNotifications = await this.textMessageNotificationRepository.count(
            filters,
        );

        return {
            total:
                unreadCallForHelpNotifications +
                unreadDonationNotifications +
                unreadDonationRequestNotifications +
                unreadFamilyInNeedNotifications +
                unreadTextMessageNotifications,
        };
    }
}

export { GetNumberOfUnreadNotificationsUseCase };
