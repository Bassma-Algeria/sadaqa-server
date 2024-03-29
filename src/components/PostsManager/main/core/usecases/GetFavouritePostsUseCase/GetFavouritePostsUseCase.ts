import { UseCase } from '../UseCase';
import { GetFavouritePostsUseCaseRequest } from './GetFavouritePostsUseCaseRequest';
import { GetFavouritePostsUseCaseResponse } from './GetFavouritePostsUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { PostType } from '../../domain/PostType';
import { DonationPost } from '../../domain/DonationPost';
import { FavouritePost } from '../../domain/FavouritePost';
import { CallForHelpPost } from '../../domain/CallForHelpPost';
import { FamilyInNeedPost } from '../../domain/FamilyInNeedPost';
import { DonationRequestPost } from '../../domain/DonationRequestPost';

import { UsersService } from '../../domain/services/UsersService';
import { DonationPostRepository } from '../../domain/services/PostRepository/DonationPostRepository';
import { FavouritePostRepository } from '../../domain/services/PostRepository/FavouritePostRepository';
import { CallForHelpPostRepository } from '../../domain/services/PostRepository/CallForHelpPostRepository';
import { FamilyInNeedPostRepository } from '../../domain/services/PostRepository/FamilyInNeedPostRepository';
import { DonationRequestPostRepository } from '../../domain/services/PostRepository/DonationRequestPostRepository';

import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../domain/exceptions/AuthorizationException';

import { DonationPostDtoMapper } from '../_common_/dtos/DonationPostDtoMapper';
import { CallForHelpPostDtoMapper } from '../_common_/dtos/CallForHelpPostDtoMapper';
import { FamilyInNeedPostDtoMapper } from '../_common_/dtos/FamilyInNeedPostDtoMapper';
import { DonationRequestPostDtoMapper } from '../_common_/dtos/DonationRequestPostDtoMapper';

class GetFavouritePostsUseCase
    implements UseCase<GetFavouritePostsUseCaseRequest, GetFavouritePostsUseCaseResponse>
{
    constructor(
        private readonly usersService: UsersService,
        private readonly donationPostRepository: DonationPostRepository,
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly callForHelpPostRepository: CallForHelpPostRepository,
        private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
        private readonly donationRequestPostRepository: DonationRequestPostRepository,
    ) {}

    async handle(
        request: GetFavouritePostsUseCaseRequest,
    ): Promise<GetFavouritePostsUseCaseResponse> {
        const { userId } = await this.validateAndGetUserIdFrom(request);

        const favouritePosts = await this.getFavouritePostsBy(userId);

        const donations = await this.getDonationsFrom(favouritePosts);
        const callForHelps = await this.getCallForHelpsFrom(favouritePosts);
        const familiesInNeed = await this.getFamiliesInNeedFrom(favouritePosts);
        const donationRequests = await this.getDonationRequestsFrom(favouritePosts);

        return {
            donation: donations.map(donation =>
                DonationPostDtoMapper.getInstance().toDto(donation),
            ),
            callForHelp: callForHelps.map(post =>
                CallForHelpPostDtoMapper.getInstance().toDto(post),
            ),
            familyInNeed: familiesInNeed.map(post =>
                FamilyInNeedPostDtoMapper.getInstance().toDto(post),
            ),
            donationRequest: donationRequests.map(post =>
                DonationRequestPostDtoMapper.getInstance().toDto(post),
            ),
        };
    }

    private async validateAndGetUserIdFrom(request: GetFavouritePostsUseCaseRequest) {
        const userId = new UserId(request.userId);

        const isExist = await this.usersService.isExist(userId);
        if (!isExist) throw new AuthorizationException(ExceptionMessages.USER_NOT_FOUND);

        return { userId };
    }

    private getFavouritePostsBy(userId: UserId) {
        return this.favouritePostRepository.findByUserId(userId);
    }

    private async getDonationsFrom(favouritePosts: FavouritePost[]) {
        const posts: DonationPost[] = await this.getPostsOfSpecificTypeFromFavourites(
            favouritePosts,
            new PostType('donation'),
        );

        return posts;
    }

    private async getDonationRequestsFrom(favouritesPosts: FavouritePost[]) {
        const posts: DonationRequestPost[] = await this.getPostsOfSpecificTypeFromFavourites(
            favouritesPosts,
            new PostType('donation-request'),
        );

        return posts;
    }

    private async getFamiliesInNeedFrom(favouritePosts: FavouritePost[]) {
        const posts: FamilyInNeedPost[] = await this.getPostsOfSpecificTypeFromFavourites(
            favouritePosts,
            new PostType('family-in-need'),
        );

        return posts;
    }

    private async getCallForHelpsFrom(favouritePosts: FavouritePost[]) {
        const posts: CallForHelpPost[] = await this.getPostsOfSpecificTypeFromFavourites(
            favouritePosts,
            new PostType('call-for-help'),
        );

        return posts;
    }

    private async getPostsOfSpecificTypeFromFavourites(
        favouritePosts: FavouritePost[],
        type: PostType,
    ) {
        const repository = this.getRightRepositoryBasedToPostType(type);
        const ids = this.getPostIdFromFavouritesBasedOnPostType(favouritePosts, type);

        const posts: any[] = [];

        for (const id of ids) {
            const post = await repository.findById(id);

            if (post) {
                posts.push(post);
            }
        }

        return posts;
    }

    private getPostIdFromFavouritesBasedOnPostType(
        favouritePosts: FavouritePost[],
        type: PostType,
    ) {
        return favouritePosts
            .filter(({ postType }) => postType.value() === type.value())
            .map(({ postId }) => postId);
    }

    private getRightRepositoryBasedToPostType(type: PostType) {
        switch (type.value()) {
            case 'donation':
                return this.donationPostRepository;
            case 'donation-request':
                return this.donationRequestPostRepository;
            case 'family-in-need':
                return this.familyInNeedPostRepository;
            case 'call-for-help':
                return this.callForHelpPostRepository;
        }
    }
}

export { GetFavouritePostsUseCase };
