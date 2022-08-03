import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { UpdateDonationPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateDonationPostUseCase/UpdateDonationPostUseCaseRequest';
import { GetDonationPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetDonationPostsListUseCase/GetDonationPostsListUseCaseRequest';

@Injectable()
class DonationPostsService {
    private readonly donationPostsManager = PostsManagerConfiguration.aDonationPostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateDonationPostUseCaseRequest, 'publisherId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationPostsManager.create({ ...request, publisherId: userId });
    }

    async update(accessToken: string, request: Omit<UpdateDonationPostUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationPostsManager.update({ ...request, userId });
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationPostsManager.delete({ ...request, userId });
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationPostsManager.toggleEnablingStatus({ ...request, userId });
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return this.donationPostsManager.getById(request);
    }

    getList(request: GetDonationPostsListUseCaseRequest) {
        return this.donationPostsManager.getList(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        console.log(request);
        return this.donationPostsManager.search(request);
    }
}

export { DonationPostsService };