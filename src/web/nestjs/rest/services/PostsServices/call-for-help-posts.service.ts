import { Injectable } from '@nestjs/common';

import { SharePostUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/SharePostUseCase/SharePostUseCaseRequest';
import { DeletePostUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { UpdateCallForHelpPostUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateCallForHelpPostUseCase/UpdateCallForHelpPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';
import { GetCallForHelpPostsListUseCaseRequest } from '../../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetCallForHelpPostsListUseCase/GetCallForHelpPostsListUseCaseRequest';

import { PostsManagerConfiguration } from '../../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { Service } from '../base/base.service';

@Injectable()
class CallForHelpPostsService extends Service {
    private readonly callForHelpPostsManager = PostsManagerConfiguration.aCallForHelpPostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateCallForHelpPostUseCaseRequest, 'publisherId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.callForHelpPostsManager.create({ ...request, publisherId: userId });
        } catch (e) {
            await this.logError('Error while creating call for help post', e);

            throw e;
        }
    }

    async update(
        accessToken: string,
        request: Omit<UpdateCallForHelpPostUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.callForHelpPostsManager.update({ ...request, userId });
        } catch (e) {
            await this.logError('Error while updating call for help post', e);

            throw e;
        }
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.callForHelpPostsManager.delete({ ...request, userId });
        } catch (e) {
            await this.logError('Error while deleting call for help post', e);

            throw e;
        }
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.callForHelpPostsManager.toggleEnablingStatus({ ...request, userId });
        } catch (e) {
            await this.logError('Error while toggling enabling status of call for help post', e);

            throw e;
        }
    }

    async getById(request: GetPostByIdUseCaseRequest) {
        try {
            return await this.callForHelpPostsManager.getById(request);
        } catch (e) {
            await this.logError('Error while getting call for help post by id', e);

            throw e;
        }
    }

    async getList(request: GetCallForHelpPostsListUseCaseRequest) {
        try {
            return await this.callForHelpPostsManager.getList(request);
        } catch (e) {
            await this.logError('Error while getting call for help posts list', e);

            throw e;
        }
    }

    async search(request: SearchForPostsUseCaseRequest) {
        try {
            return await this.callForHelpPostsManager.search(request);
        } catch (e) {
            await this.logError('Error while searching for call for help post', e);

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

            return await this.callForHelpPostsManager.share({ ...request, userId });
        } catch (e) {
            await this.logError('Error while sharing call for help post', e);

            throw e;
        }
    }
}

export { CallForHelpPostsService };
