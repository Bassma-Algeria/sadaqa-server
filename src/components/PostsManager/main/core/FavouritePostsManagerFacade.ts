import { UsersService } from './domain/services/UsersService';
import { DonationPostRepository } from './domain/services/PostRepository/DonationPostRepository';
import { FavouritePostRepository } from './domain/services/PostRepository/FavouritePostRepository';
import { CallForHelpPostRepository } from './domain/services/PostRepository/CallForHelpPostRepository';
import { FamilyInNeedPostRepository } from './domain/services/PostRepository/FamilyInNeedPostRepository';
import { FavouritePostEventPublisher } from './domain/services/PostEventPublisher/FavouritePostEventPublisher';
import { DonationRequestPostRepository } from './domain/services/PostRepository/DonationRequestPostRepository';

import { AddToFavouritePostsUseCase } from './usecases/AddToFavouritePostsUseCase/AddToFavouritePostsUseCase';
import { AddToFavouritePostsUseCaseRequest } from './usecases/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';

import { DeleteFromFavouriteUseCase } from './usecases/DeleteFromFavouriteUseCase/DeleteFromFavouriteUseCase';
import { DeleteFromFavouriteUseCaseRequest } from './usecases/DeleteFromFavouriteUseCase/DeleteFromFavouriteUseCaseRequest';

import { GetFavouritePostsUseCase } from './usecases/GetFavouritePostsUseCase/GetFavouritePostsUseCase';
import { GetFavouritePostsUseCaseRequest } from './usecases/GetFavouritePostsUseCase/GetFavouritePostsUseCaseRequest';

import { IsPostInFavouritesUseCase } from './usecases/IsPostInFavouritesUseCase/IsPostInFavouritesUseCase';
import { IsPostInFavouritesUseCaseRequest } from './usecases/IsPostInFavouritesUseCase/IsPostInFavouritesUseCaseRequest';

class FavouritePostsManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly donationPostRepository: DonationPostRepository,
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly callForHelpPostRepository: CallForHelpPostRepository,
        private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
        private readonly favouritePostEventPublisher: FavouritePostEventPublisher,
        private readonly donationRequestPostRepository: DonationRequestPostRepository,
    ) {}

    addToFavourite(request: AddToFavouritePostsUseCaseRequest) {
        return new AddToFavouritePostsUseCase(
            this.usersService,
            this.donationPostRepository,
            this.favouritePostRepository,
            this.callForHelpPostRepository,
            this.familyInNeedPostRepository,
            this.favouritePostEventPublisher,
            this.donationRequestPostRepository,
        ).handle(request);
    }

    deleteFromFavourite(request: DeleteFromFavouriteUseCaseRequest) {
        return new DeleteFromFavouriteUseCase(
            this.favouritePostRepository,
            this.favouritePostEventPublisher,
        ).handle(request);
    }

    getFavouritePosts(request: GetFavouritePostsUseCaseRequest) {
        return new GetFavouritePostsUseCase(
            this.usersService,
            this.donationPostRepository,
            this.favouritePostRepository,
            this.callForHelpPostRepository,
            this.familyInNeedPostRepository,
            this.donationRequestPostRepository,
        ).handle(request);
    }

    isPostInFavourite(request: IsPostInFavouritesUseCaseRequest) {
        return new IsPostInFavouritesUseCase(this.favouritePostRepository).handle(request);
    }
}

export { FavouritePostsManagerFacade };
