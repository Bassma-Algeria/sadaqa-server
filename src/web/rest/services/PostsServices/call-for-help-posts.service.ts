import { Injectable } from '@nestjs/common';

import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { UpdateCallForHelpPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateCallForHelpPostUseCase/UpdateCallForHelpPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';
import { GetCallForHelpPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetCallForHelpPostsListUseCase/GetCallForHelpPostsListUseCaseRequest';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class CallForHelpPostsService {
    private readonly callForHelpPostsManager = PostsManagerConfiguration.aCallForHelpPostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateCallForHelpPostUseCaseRequest, 'publisherId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.callForHelpPostsManager.create({ ...request, publisherId: userId });
    }

    async update(
        accessToken: string,
        request: Omit<UpdateCallForHelpPostUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.callForHelpPostsManager.update({ ...request, userId });
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.callForHelpPostsManager.delete({ ...request, userId });
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.callForHelpPostsManager.toggleEnablingStatus({ ...request, userId });
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return this.callForHelpPostsManager.getById(request);
    }

    getList(request: GetCallForHelpPostsListUseCaseRequest) {
        return this.callForHelpPostsManager.getList(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return this.callForHelpPostsManager.search(request);
    }
}

export { CallForHelpPostsService };