import { UserId } from '../core/domain/UserId';
import { PostTokens } from '../core/domain/PostTokens';

import { PostsService } from '../core/domain/services/PostsService';

import { DonationRequestPostsManagerFacade } from '../../../PostsManager/main/core/DonationRequestPostsManagerFacade';
import { DonationPostsManagerFacade } from '../../../PostsManager/main/core/DonationPostsManagerFacade';

class PostsServiceImpl implements PostsService {
    constructor(
        private readonly donationPostsManager: DonationPostsManagerFacade,
        private readonly donationRequestPostsManager: DonationRequestPostsManagerFacade,
    ) {}

    async getPublishersOfDonationRequestsThatMatch(postTokens: PostTokens): Promise<UserId[]> {
        const targetIds: UserId[] = [];

        for (const token of postTokens.iterator()) {
            let isSearchEnd = false;

            for (let page = 1; !isSearchEnd; page++) {
                const { end, list } = await this.donationRequestPostsManager.search({
                    keyword: token,
                    page,
                });

                isSearchEnd = end;

                list.map(({ publisherId }) => targetIds.push(new UserId(publisherId)));
            }
        }

        return targetIds;
    }

    async getPublishersOfDonationsThatMatch(postTokens: PostTokens): Promise<UserId[]> {
        const targetIds: UserId[] = [];

        for (const token of postTokens.iterator()) {
            let isSearchEnd = false;

            for (let page = 1; !isSearchEnd; page++) {
                const { end, list } = await this.donationPostsManager.search({
                    keyword: token,
                    page,
                });

                isSearchEnd = end;

                list.map(({ publisherId }) => targetIds.push(new UserId(publisherId)));
            }
        }

        return targetIds;
    }
}

export { PostsServiceImpl };