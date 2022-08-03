import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';
import { UpdateFamilyInNeedPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateFamilyInNeedPostUseCase/UpdateFamilyInNeedPostUseCaseRequest';
import { GetFamilyInNeedPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetFamilyInNeedPostsListUseCase/GetFamilyInNeedPostsListUseCaseRequest';

@Injectable()
class FamilyInNeedPostsService {
    private readonly familyInNeedPostsManager =
        PostsManagerConfiguration.aFamilyInNeedPostsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateFamilyInNeedPostUseCaseRequest, 'publisherId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.familyInNeedPostsManager.create({ ...request, publisherId: userId });
    }

    async update(
        accessToken: string,
        request: Omit<UpdateFamilyInNeedPostUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.familyInNeedPostsManager.update({ ...request, userId });
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.familyInNeedPostsManager.delete({ ...request, userId });
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.familyInNeedPostsManager.toggleEnablingStatus({ ...request, userId });
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return this.familyInNeedPostsManager.getById(request);
    }

    getList(request: GetFamilyInNeedPostsListUseCaseRequest) {
        return this.familyInNeedPostsManager.getList(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return this.familyInNeedPostsManager.search(request);
    }
}

export { FamilyInNeedPostsService };