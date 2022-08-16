import { PostsService } from './core/domain/services/PostsService';
import { UsersService } from './core/domain/services/UsersService';
import { NotificationIdGenerator } from './core/domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from './core/domain/services/NotificationEventPublisher';
import { TextMessageNotificationRepository } from './core/domain/services/repositories/TextMessageNotificationRepository';
import { DonationPostNotificationRepository } from './core/domain/services/repositories/DonationPostNotificationRepository';
import { CallForHelpPostNotificationRepository } from './core/domain/services/repositories/CallForHelpPostNotificationRepository';
import { FamilyInNeedPostNotificationRepository } from './core/domain/services/repositories/FamilyInNeedPostNotificationRepository';
import { DonationRequestPostNotificationRepository } from './core/domain/services/repositories/DonationRequestPostNotificationRepository';

import { CreateNewDonationPostNotificationUseCase } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationPostNotificationUseCase/CreateNewDonationPostNotificationUseCase';
import { CreateNewDonationPostNotificationUseCaseRequest } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationPostNotificationUseCase/CreateNewDonationPostNotificationUseCaseRequest';

import { GetNotificationsUseCase } from './core/usecases/GetNotificationsUseCase/GetNotificationsUseCase';
import { GetNotificationsUseCaseRequest } from './core/usecases/GetNotificationsUseCase/GetNotificationsUseCaseRequest';

import { CreateNewDonationRequestPostNotificationUseCase } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationRequestPostNotificationUseCase/CreateNewDonationRequestPostNotificationUseCase';
import { CreateNewDonationRequestPostNotificationUseCaseRequest } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationRequestPostNotificationUseCase/CreateNewDonationRequestPostNotificationUseCaseRequest';

import { CreateNewFamilyInNeedPostNotificationUseCase } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewFamilyInNeedPostNotificationUseCase/CreateNewFamilyInNeedPostNotificationUseCase';
import { CreateNewFamilyInNeedPostNotificationUseCaseRequest } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewFamilyInNeedPostNotificationUseCase/CreateNewFamilyInNeedPostNotificationUseCaseRequest';

import { CreateNewCallForHelpPostNotificationUseCase } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewCallForHelpPostNotificationUseCase/CreateNewCallForHelpPostNotificationUseCase';
import { CreateNewCallForHelpPostNotificationUseCaseRequest } from './core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewCallForHelpPostNotificationUseCase/CreateNewCallForHelpPostNotificationUseCaseRequest';

import { CreateTextMessageNotificationUseCase } from './core/usecases/CreateNotificationUseCases/CreateMessageNotificationUseCases/CreateTextMessageNotificationUseCase/CreateTextMessageNotificationUseCase';
import { CreateTextMessageNotificationUseCaseRequest } from './core/usecases/CreateNotificationUseCases/CreateMessageNotificationUseCases/CreateTextMessageNotificationUseCase/CreateTextMessageNotificationUseCaseRequest';
import { GetNumberOfUnreadNotificationsUseCaseRequest } from './core/usecases/GetNumberOfUnreadNotificationsUseCase/GetNumberOfUnreadNotificationsUseCaseRequest';
import { GetNumberOfUnreadNotificationsUseCase } from './core/usecases/GetNumberOfUnreadNotificationsUseCase/GetNumberOfUnreadNotificationsUseCase';
import { MakeNotificationReadUseCaseRequest } from './core/usecases/MakeNotificationReadUseCase/MakeNotificationReadUseCaseRequest';
import { MakeNotificationReadUseCase } from './core/usecases/MakeNotificationReadUseCase/MakeNotificationReadUseCase';
import { GetNotificationTypeByIdUseCase } from './core/usecases/GetNotificationTypeByIdUseCase/GetNotificationTypeByIdUseCase';
import { GetNotificationTypeByIdUseCaseRequest } from './core/usecases/GetNotificationTypeByIdUseCase/GetNotificationTypeByIdUseCaseRequest';
import { MakeNotificationClickedUseCaseRequest } from './core/usecases/NotificationClickedUseCase/MakeNotificationClickedUseCaseRequest';
import { MakeNotificationClickedUseCase } from './core/usecases/NotificationClickedUseCase/MakeNotificationClickedUseCase';

class NotificationsManagerFacade {
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
        private readonly textMessageNotificationRepository: TextMessageNotificationRepository,
        private readonly donationPostNotificationRepository: DonationPostNotificationRepository,
        private readonly callForHelpPostNotificationRepository: CallForHelpPostNotificationRepository,
        private readonly familyInNeedPostNotificationRepository: FamilyInNeedPostNotificationRepository,
        private readonly donationRequestPostNotificationRepository: DonationRequestPostNotificationRepository,
    ) {}

    createNewDonationPostNotification(request: CreateNewDonationPostNotificationUseCaseRequest) {
        return new CreateNewDonationPostNotificationUseCase(
            this.postsService,
            this.usersService,
            this.notificationIdGenerator,
            this.notificationEventPublisher,
            this.donationPostNotificationRepository,
        ).handle(request);
    }

    createNewDonationRequestPostNotification(
        request: CreateNewDonationRequestPostNotificationUseCaseRequest,
    ) {
        return new CreateNewDonationRequestPostNotificationUseCase(
            this.postsService,
            this.usersService,
            this.notificationIdGenerator,
            this.notificationEventPublisher,
            this.donationRequestPostNotificationRepository,
        ).handle(request);
    }

    createNewFamilyInNeedPostNotification(
        request: CreateNewFamilyInNeedPostNotificationUseCaseRequest,
    ) {
        return new CreateNewFamilyInNeedPostNotificationUseCase(
            this.usersService,
            this.notificationIdGenerator,
            this.notificationEventPublisher,
            this.familyInNeedPostNotificationRepository,
        ).handle(request);
    }

    createNewCallForHelpPostNotification(
        request: CreateNewCallForHelpPostNotificationUseCaseRequest,
    ) {
        return new CreateNewCallForHelpPostNotificationUseCase(
            this.usersService,
            this.notificationIdGenerator,
            this.notificationEventPublisher,
            this.callForHelpPostNotificationRepository,
        ).handle(request);
    }

    createTextMessageNotification(request: CreateTextMessageNotificationUseCaseRequest) {
        return new CreateTextMessageNotificationUseCase(
            this.notificationIdGenerator,
            this.notificationEventPublisher,
            this.textMessageNotificationRepository,
        ).handle(request);
    }

    getNotifications(request: GetNotificationsUseCaseRequest) {
        return new GetNotificationsUseCase(
            this.textMessageNotificationRepository,
            this.donationPostNotificationRepository,
            this.callForHelpPostNotificationRepository,
            this.familyInNeedPostNotificationRepository,
            this.donationRequestPostNotificationRepository,
        ).handle(request);
    }

    getNumberOfUnreadNotification(request: GetNumberOfUnreadNotificationsUseCaseRequest) {
        return new GetNumberOfUnreadNotificationsUseCase(
            this.textMessageNotificationRepository,
            this.donationPostNotificationRepository,
            this.callForHelpPostNotificationRepository,
            this.familyInNeedPostNotificationRepository,
            this.donationRequestPostNotificationRepository,
        ).handle(request);
    }

    async makeNotificationRead(request: MakeNotificationReadUseCaseRequest) {
        const { type } = await this.getNotificationType(request);

        return new MakeNotificationReadUseCase(
            this.notificationEventPublisher,
            this.getRepositoryDependsOnType(type),
        ).handle(request);
    }

    async makeNotificationClicked(request: MakeNotificationClickedUseCaseRequest) {
        const { type } = await this.getNotificationType(request);

        return new MakeNotificationClickedUseCase(
            this.notificationEventPublisher,
            this.getRepositoryDependsOnType(type),
        ).handle(request);
    }

    private getNotificationType(request: GetNotificationTypeByIdUseCaseRequest) {
        return new GetNotificationTypeByIdUseCase(
            this.textMessageNotificationRepository,
            this.donationPostNotificationRepository,
            this.callForHelpPostNotificationRepository,
            this.familyInNeedPostNotificationRepository,
            this.donationRequestPostNotificationRepository,
        ).handle(request);
    }

    private getRepositoryDependsOnType(notificationType: string) {
        switch (notificationType) {
            case 'NEW_TEXT_MESSAGE':
                return this.textMessageNotificationRepository;

            case 'NEW_DONATION_POST':
                return this.donationPostNotificationRepository;

            case 'NEW_DONATION_REQUEST_POST':
                return this.donationRequestPostNotificationRepository;

            case 'NEW_FAMILY_IN_NEED_POST':
                return this.familyInNeedPostNotificationRepository;

            case 'NEW_CALL_FOR_HELP_POST':
                return this.callForHelpPostNotificationRepository;

            default:
                throw new Error('type not supported');
        }
    }
}


export { NotificationsManagerFacade };
