import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { SharePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SharePostUseCase/SharePostUseCaseRequest';
import { DeletePostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/DeletePostUseCase/DeletePostUseCaseRequest';
import { GetPostByIdUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';
import { SearchForPostsUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';
import { TogglePostEnablingStatusUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/CreatePostUseCases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { UpdateDonationPostUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/UpdatePostUseCases/UpdateDonationPostUseCase/UpdateDonationPostUseCaseRequest';
import { GetDonationPostsListUseCaseRequest } from '../../../../components/PostsManager/main/core/usecases/GetPostsListUseCases/GetDonationPostsListUseCase/GetDonationPostsListUseCaseRequest';

import { Service } from '../base/base.service';

@Injectable()
class DonationPostsService extends Service {
    private readonly donationPostsManager = PostsManagerConfiguration.aDonationPostsManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async create(
        accessToken: string,
        request: Omit<CreateDonationPostUseCaseRequest, 'publisherId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationPostsManager.create({ ...request, publisherId: userId });
        } catch (e) {
            await this.logError('Error while creating a donation post', e);

            throw e;
        }
    }

    async update(accessToken: string, request: Omit<UpdateDonationPostUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationPostsManager.update({ ...request, userId });
        } catch (e) {
            await this.logError('Error while updating donation post', e);

            throw e;
        }
    }

    async delete(accessToken: string, request: Omit<DeletePostUseCaseRequest, 'userId'>) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationPostsManager.delete({ ...request, userId });
        } catch (e) {
            await this.logError('Error while deleting donation post', e);

            throw e;
        }
    }

    async toggleEnablingStatus(
        accessToken: string,
        request: Omit<TogglePostEnablingStatusUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });
            return await this.donationPostsManager.toggleEnablingStatus({ ...request, userId });
        } catch (e) {
            await this.logError('Error while toggling enabling status of donation post', e);

            throw e;
        }
    }

    async getById(request: GetPostByIdUseCaseRequest) {
        try {
            return await this.donationPostsManager.getById(request);
        } catch (e) {
            await this.logError('Error while getting donation post by id', e);

            throw e;
        }
    }

    async getList(request: GetDonationPostsListUseCaseRequest) {
        try {
            return await this.donationPostsManager.getList(request);
        } catch (e) {
            await this.logError('Error while getting donation posts list', e);

            throw e;
        }
    }

    async search(request: SearchForPostsUseCaseRequest) {
        try {
            return await this.donationPostsManager.search(request);
        } catch (e) {
            await this.logError('Error while searching for donation post', e);

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

            return await this.donationPostsManager.share({ ...request, userId });
        } catch (e) {
            await this.logError('Error while sharing donation post', e);

            throw e;
        }
    }
}

export { DonationPostsService };
