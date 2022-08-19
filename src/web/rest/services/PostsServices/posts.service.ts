import { Injectable } from '@nestjs/common';
import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';

@Injectable()
class PostsService {
    private readonly donationPostsManager = PostsManagerConfiguration.aDonationPostsManager();
    private readonly callForHelpPostsManager = PostsManagerConfiguration.aCallForHelpPostsManager();

    private readonly donationRequestPostsManager =
        PostsManagerConfiguration.aDonationRequestPostsManager();

    private readonly familyInNeedPostsManager =
        PostsManagerConfiguration.aFamilyInNeedPostsManager();

    async getPostsByPublisher(publisherId: string) {
        const { list: donation } = await this.donationPostsManager.getByPublisherId({
            publisherId,
        });
        const { list: donationRequest } = await this.donationRequestPostsManager.getByPublisherId({
            publisherId,
        });
        const { list: familyInNeed } = await this.familyInNeedPostsManager.getByPublisherId({
            publisherId,
        });
        const { list: callForHelp } = await this.callForHelpPostsManager.getByPublisherId({
            publisherId,
        });

        return { donation, donationRequest, familyInNeed, callForHelp };
    }
}

export { PostsService };
