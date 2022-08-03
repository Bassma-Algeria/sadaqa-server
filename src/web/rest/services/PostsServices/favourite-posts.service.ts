import { Injectable } from '@nestjs/common';

import { AddToFavouritePostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';
import { DeleteFromFavouriteUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeleteFromFavouriteUseCase/DeleteFromFavouriteUseCaseRequest';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class FavouritePostsService {
    private readonly favouritePostsManager = PostsManagerConfiguration.aFavouritePostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async add(accessToken: string, request: Omit<AddToFavouritePostsUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.favouritePostsManager.addToFavourite({ ...request, userId });
    }

    async delete(accessToken: string, request: Omit<DeleteFromFavouriteUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.favouritePostsManager.deleteFromFavourite({ ...request, userId });
    }

    async getAll(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.favouritePostsManager.getFavouritePosts({ userId });
    }
}

export { FavouritePostsService };