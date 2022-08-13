import { PostsService } from './core/domain/services/PostsService';
import { UsersService } from './core/domain/services/UsersService';
import { NotificationIdGenerator } from './core/domain/services/NotificationIdGenerator';
import { NotificationEventPublisher } from './core/domain/services/NotificationEventPublisher';
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

class NotificationsManagerFacade {
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly notificationIdGenerator: NotificationIdGenerator,
        private readonly notificationEventPublisher: NotificationEventPublisher,
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

    getNotifications(request: GetNotificationsUseCaseRequest) {
        return new GetNotificationsUseCase(
            this.donationPostNotificationRepository,
            this.callForHelpPostNotificationRepository,
            this.familyInNeedPostNotificationRepository,
            this.donationRequestPostNotificationRepository,
        ).handle(request);
    }
}

export { NotificationsManagerFacade };