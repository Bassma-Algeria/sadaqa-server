import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { SharePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SharePostUseCase/SharePostUseCaseRequest';
import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateDonationRequestPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';
import { UpdateDonationRequestPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateDonationRequestPostUseCase/UpdateDonationRequestPostUseCaseRequest';
import { GetDonationRequestPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetDonationRequestPostsListUseCase/GetDonationRequestPostsListUseCaseRequest';

import { Service } from '../base/base.service';

@Injectable()
class DonationRequestPostsService extends Service {
    private readonly donationRequestPostsManager =
        PostsManagerConfiguration.aDonationRequestPostsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateDonationRequestPostUseCaseRequest, 'publisherId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationRequestPostsManager.create({
                ...request,
                publisherId: userId,
            });
        } catch (e) {
            await this.logError('Error while creating donation request post', e);

            throw e;
        }
    }

    async update(
        accessToken: string,
        request: Omit<UpdateDonationRequestPostUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationRequestPostsManager.update({ ...request, userId });
        } catch (e) {
            await this.logError('Error while updating donation request post', e);

            throw e;
        }
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationRequestPostsManager.delete({ ...request, userId });
        } catch (e) {
            await this.logError('Error while deleting donation request post', e);

            throw e;
        }
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationRequestPostsManager.toggleEnablingStatus({
                ...request,
                userId,
            });
        } catch (e) {
            await this.logError('Error while toggling donation request enabling status', e);

            throw e;
        }
    }

    async getById(request: GetPostByIdUseCaseRequest) {
        try {
            return await this.donationRequestPostsManager.getById(request);
        } catch (e) {
            await this.logError('Error while getting donation request by id', e);

            throw e;
        }
    }

    async getList(request: GetDonationRequestPostsListUseCaseRequest) {
        try {
            return await this.donationRequestPostsManager.getList(request);
        } catch (e) {
            await this.logError('Error while getting donation request posts list', e);

            throw e;
        }
    }

    async search(request: SearchForPostsUseCaseRequest) {
        try {
            return await this.donationRequestPostsManager.search(request);
        } catch (e) {
            await this.logError('Error while searching for donation requests', e);

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

            return await this.donationRequestPostsManager.share({ ...request, userId });
        } catch (e) {
            await this.logError('Error while sharing donation request post', e);

            throw e;
        }
    }
}

export { DonationRequestPostsService };
