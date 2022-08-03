import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateDonationRequestPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';
import { UpdateDonationRequestPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateDonationRequestPostUseCase/UpdateDonationRequestPostUseCaseRequest';
import { GetDonationRequestPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetDonationRequestPostsListUseCase/GetDonationRequestPostsListUseCaseRequest';

@Injectable()
class DonationRequestPostsService {
    private readonly donationRequestPostsManager =
        PostsManagerConfiguration.aDonationRequestPostsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateDonationRequestPostUseCaseRequest, 'publisherId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationRequestPostsManager.create({ ...request, publisherId: userId });
    }

    async update(
        accessToken: string,
        request: Omit<UpdateDonationRequestPostUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationRequestPostsManager.update({ ...request, userId });
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationRequestPostsManager.delete({ ...request, userId });
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
        return this.donationRequestPostsManager.toggleEnablingStatus({ ...request, userId });
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return this.donationRequestPostsManager.getById(request);
    }

    getList(request: GetDonationRequestPostsListUseCaseRequest) {
        return this.donationRequestPostsManager.getList(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return this.donationRequestPostsManager.search(request);
    }
}

export { DonationRequestPostsService };