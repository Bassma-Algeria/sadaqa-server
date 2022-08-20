import { Injectable } from '@nestjs/common';
import { PostsManagerConfiguration } from '../../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class PostsService {
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

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

    async getPostsSummaryOfAuthUser(accessToken: string) {
        const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
            accessToken,
        });

        const donation = await this.donationPostsManager.getSummaryByPublisherId({ publisherId });
        const donationRequest = await this.donationRequestPostsManager.getSummaryByPublisherId({
            publisherId,
        });
        const familyInNeed = await this.familyInNeedPostsManager.getSummaryByPublisherId({
            publisherId,
        });
        const callForHelp = await this.callForHelpPostsManager.getSummaryByPublisherId({
            publisherId,
        });

        return { donation, donationRequest, familyInNeed, callForHelp };
    }
}

export { PostsService };
