import { UseCase } from '../UseCase';
import { GetNotificationsUseCaseRequest } from './GetNotificationsUseCaseRequest';
import { GetNotificationsUseCaseResponse } from './GetNotificationsUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { Notification } from '../../domain/Notification';
import { DonationPostNotification } from '../../domain/DonationPostNotification';
import { CallForHelpPostNotification } from '../../domain/CallForHelpPostNotification';
import { FamilyInNeedPostNotification } from '../../domain/FamilyInNeedPostNotification';
import { DonationRequestPostNotification } from '../../domain/DonationRequestPostNotification';

import { DonationPostNotificationRepository } from '../../domain/services/repositories/DonationPostNotificationRepository';
import { CallForHelpPostNotificationRepository } from '../../domain/services/repositories/CallForHelpPostNotificationRepository';
import { FamilyInNeedPostNotificationRepository } from '../../domain/services/repositories/FamilyInNeedPostNotificationRepository';
import { DonationRequestPostNotificationRepository } from '../../domain/services/repositories/DonationRequestPostNotificationRepository';

import { DonationPostNotificationDtoMapper } from '../_common_/dtos/DonationPostNotificationDtoMapper';
import { CallForHelpPostNotificationDtoMapper } from '../_common_/dtos/CallForHelpPostNotificationDtoMapper';
import { FamilyInNeedPostNotificationDtoMapper } from '../_common_/dtos/FamilyInNeedPostNotificationDtoMapper';
import { DonationRequestPostNotificationDtoMapper } from '../_common_/dtos/DonationRequestPostNotificationDtoMapper';

import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../domain/exceptions/ValidationException';
import { TextMessageNotificationRepository } from '../../domain/services/repositories/TextMessageNotificationRepository';
import { TextMessageNotification } from '../../domain/TextMessageNotification';
import { TextMessageNotificationDtoMapper } from '../_common_/dtos/TextMessageNotificationDtoMapper';

class GetNotificationsUseCase
    implements UseCase<GetNotificationsUseCaseRequest, GetNotificationsUseCaseResponse>
{
    private readonly PAGE_LIMIT = 10;

    constructor(
        private readonly textMessageNotificationRepository: TextMessageNotificationRepository,
        private readonly donationPostNotificationRepository: DonationPostNotificationRepository,
        private readonly callForHelpPostNotificationRepository: CallForHelpPostNotificationRepository,
        private readonly familyInNeedPostNotificationRepository: FamilyInNeedPostNotificationRepository,
        private readonly donationRequestPostNotificationRepository: DonationRequestPostNotificationRepository,
    ) {}

    async handle(
        request: GetNotificationsUseCaseRequest,
    ): Promise<GetNotificationsUseCaseResponse> {
        const { page, receiverId } = this.getFrom(request);

        const textMessageNotifications = await this.textMessageNotificationRepository.findMany({
            receiverId,
        });

        const donationPostNotifications = await this.donationPostNotificationRepository.findMany({
            receiverId,
        });

        const donationRequestPostNotifications =
            await this.donationRequestPostNotificationRepository.findMany({ receiverId });

        const familyInNeedPostNotifications =
            await this.familyInNeedPostNotificationRepository.findMany({ receiverId });

        const callForHelpPostNotifications =
            await this.callForHelpPostNotificationRepository.findMany({ receiverId });

        const notifications = [
            ...textMessageNotifications,
            ...donationPostNotifications,
            ...callForHelpPostNotifications,
            ...familyInNeedPostNotifications,
            ...donationRequestPostNotifications,
        ];

        return {
            page,
            total: notifications.length,
            end: this.isEndPage({ total: notifications.length, page }),
            list: notifications
                .sort(GetNotificationsUseCase.orderByCreatedAt)
                .slice((page - 1) * this.PAGE_LIMIT, page * this.PAGE_LIMIT)
                .map(GetNotificationsUseCase.toDto),
        };
    }

    private getFrom(request: GetNotificationsUseCaseRequest) {
        const page = request.page ?? 1;
        const receiverId = new UserId(request.receiverId);

        if (page <= 0) throw new ValidationException(ExceptionMessages.INVALID_PAGE_NUMBER);

        return { page, receiverId };
    }

    private static orderByCreatedAt(a: Notification, b: Notification) {
        if (a.createdAt.getTime() < b.createdAt.getTime()) return 1;
        if (a.createdAt.getTime() > b.createdAt.getTime()) return -1;
        return 0;
    }

    private isEndPage({ page, total }: { total: number; page: number }) {
        return page * this.PAGE_LIMIT >= total;
    }

    private static toDto(notification: Notification) {
        if (notification instanceof DonationPostNotification)
            return DonationPostNotificationDtoMapper.toDto(notification);

        if (notification instanceof FamilyInNeedPostNotification)
            return FamilyInNeedPostNotificationDtoMapper.toDto(notification);

        if (notification instanceof CallForHelpPostNotification)
            return CallForHelpPostNotificationDtoMapper.toDto(notification);

        if (notification instanceof DonationRequestPostNotification)
            return DonationRequestPostNotificationDtoMapper.toDto(notification);

        if (notification instanceof TextMessageNotification)
            return TextMessageNotificationDtoMapper.toDto(notification);

        throw new Error('notification type not exist');
    }
}

export { GetNotificationsUseCase };
