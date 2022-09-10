import { UseCase } from '../UseCase';
import { GetNotificationTypeByIdUseCaseRequest } from './GetNotificationTypeByIdUseCaseRequest';
import { GetNotificationTypeByIdUseCaseResponse } from './GetNotificationTypeByIdUseCaseResponse';

import { Notification } from '../../domain/Notification';
import { NotificationId } from '../../domain/NotificationId';

import { TextMessageNotificationRepository } from '../../domain/services/repositories/TextMessageNotificationRepository';
import { DonationPostNotificationRepository } from '../../domain/services/repositories/DonationPostNotificationRepository';
import { CallForHelpPostNotificationRepository } from '../../domain/services/repositories/CallForHelpPostNotificationRepository';
import { FamilyInNeedPostNotificationRepository } from '../../domain/services/repositories/FamilyInNeedPostNotificationRepository';
import { DonationRequestPostNotificationRepository } from '../../domain/services/repositories/DonationRequestPostNotificationRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class GetNotificationTypeByIdUseCase
    implements
        UseCase<GetNotificationTypeByIdUseCaseRequest, GetNotificationTypeByIdUseCaseResponse>
{
    constructor(
        private readonly textMessageNotificationRepository: TextMessageNotificationRepository,
        private readonly donationPostNotificationRepository: DonationPostNotificationRepository,
        private readonly callForHelpPostNotificationRepository: CallForHelpPostNotificationRepository,
        private readonly familyInNeedPostNotificationRepository: FamilyInNeedPostNotificationRepository,
        private readonly donationRequestPostNotificationRepository: DonationRequestPostNotificationRepository,
    ) {}

    async handle(
        request: GetNotificationTypeByIdUseCaseRequest,
    ): Promise<GetNotificationTypeByIdUseCaseResponse> {
        const notificationId = new NotificationId(request.notificationId);

        const notification = await this.findNotificationByIdThrowIfNotExist(notificationId);

        return { type: notification.type };
    }

    private async findNotificationByIdThrowIfNotExist(id: NotificationId): Promise<Notification> {
        const textMessageNotif = await this.textMessageNotificationRepository.findById(id);
        if (textMessageNotif) return textMessageNotif;

        const donationPostNotif = await this.donationPostNotificationRepository.findById(id);
        if (donationPostNotif) return donationPostNotif;

        const callForHelpNotif = await this.callForHelpPostNotificationRepository.findById(id);
        if (callForHelpNotif) return callForHelpNotif;

        const familyInNeedNotif = await this.familyInNeedPostNotificationRepository.findById(id);
        if (familyInNeedNotif) return familyInNeedNotif;

        const donationRequestNotif = await this.donationRequestPostNotificationRepository.findById(
            id,
        );
        if (donationRequestNotif) return donationRequestNotif;

        throw new NotFoundException(ExceptionMessages.NOTIFICATION_NOT_FOUND);
    }
}

export { GetNotificationTypeByIdUseCase };
