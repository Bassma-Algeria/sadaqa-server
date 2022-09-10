import { Injectable } from '@nestjs/common';

import { IsPostInFavouritesUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/IsPostInFavouritesUseCase/IsPostInFavouritesUseCaseRequest';
import { AddToFavouritePostsUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';
import { DeleteFromFavouriteUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/DeleteFromFavouriteUseCase/DeleteFromFavouriteUseCaseRequest';

import { PostsManagerConfiguration } from '../../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { Service } from '../base/base.service';

@Injectable()
class FavouritePostsService extends Service {
    private readonly favouritePostsManager = PostsManagerConfiguration.aFavouritePostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async add(accessToken: string, request: Omit<AddToFavouritePostsUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.favouritePostsManager.addToFavourite({ ...request, userId });
        } catch (e) {
            await this.logError('Error while adding post to favourite', e);

            throw e;
        }
    }

    async delete(accessToken: string, request: Omit<DeleteFromFavouriteUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.favouritePostsManager.deleteFromFavourite({ ...request, userId });
        } catch (e) {
            await this.logError('Error while deleting post from favourite', e);

            throw e;
        }
    }

    async getAll(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.favouritePostsManager.getFavouritePosts({ userId });
        } catch (e) {
            await this.logError('Error while get favourite posts', e);

            throw e;
        }
    }

    async isFavourite(
        accessToken: string,
        request: Omit<IsPostInFavouritesUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.favouritePostsManager.isPostInFavourite({ userId, ...request });
        } catch (e) {
            await this.logError('Error while checking if post is in favourite', e);

            throw e;
        }
    }
}

export { FavouritePostsService };
