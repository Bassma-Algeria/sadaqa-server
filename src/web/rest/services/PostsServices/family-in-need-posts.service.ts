import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { SharePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SharePostUseCase/SharePostUseCaseRequest';
import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';
import { UpdateFamilyInNeedPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateFamilyInNeedPostUseCase/UpdateFamilyInNeedPostUseCaseRequest';
import { GetFamilyInNeedPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetFamilyInNeedPostsListUseCase/GetFamilyInNeedPostsListUseCaseRequest';

import { Service } from '../base/base.service';

@Injectable()
class FamilyInNeedPostsService extends Service {
    private readonly familyInNeedPostsManager =
        PostsManagerConfiguration.aFamilyInNeedPostsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateFamilyInNeedPostUseCaseRequest, 'publisherId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.familyInNeedPostsManager.create({ ...request, publisherId: userId });
        } catch (e) {
            await this.logError('Error while creating family in need post', e);

            throw e;
        }
    }

    async update(
        accessToken: string,
        request: Omit<UpdateFamilyInNeedPostUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.familyInNeedPostsManager.update({ ...request, userId });
        } catch (e) {
            await this.logError('Error while updating family in need post', e);

            throw e;
        }
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.familyInNeedPostsManager.delete({ ...request, userId });
        } catch (e) {
            await this.logError('Error while deleting family in need post', e);

            throw e;
        }
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.familyInNeedPostsManager.toggleEnablingStatus({ ...request, userId });
        } catch (e) {
            await this.logError('Error while toggling family in need enabling status', e);

            throw e;
        }
    }

    async getById(request: GetPostByIdUseCaseRequest) {
        try {
            return await this.familyInNeedPostsManager.getById(request);
        } catch (e) {
            await this.logError('Error while getting family in need by id', e);

            throw e;
        }
    }

    async getList(request: GetFamilyInNeedPostsListUseCaseRequest) {
        try {
            return await this.familyInNeedPostsManager.getList(request);
        } catch (e) {
            await this.logError('Error while', e);

            throw e;
        }
    }

    async search(request: SearchForPostsUseCaseRequest) {
        try {
            return await this.familyInNeedPostsManager.search(request);
        } catch (e) {
            await this.logError('Error while searching for family in need post', e);

            throw e;
        }
    }

    async share(accessToken: string | undefined, request: Omit<SharePostUseCaseRequest, 'userId'>) {
        try {
            let userId: string | undefined;

            if (accessToken) {
                const res = await this.authenticationManager.decodeAccessToken({ accessToken });
                userId = res.userId;
            }

            return await this.familyInNeedPostsManager.share({ ...request, userId });
        } catch (e) {
            await this.logError('Error while sharing family in need post', e);

            throw e;
        }
    }
}

export { FamilyInNeedPostsService };
