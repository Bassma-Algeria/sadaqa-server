import { DonationPost } from '../DonationPost';
import { CallForHelpPost } from '../CallForHelpPost';
import { FamilyInNeedPost } from '../FamilyInNeedPost';
import { DonationRequestPost } from '../DonationRequestPost';

export interface PostsEventBus {
  publishDonationPostCreated(donationPost: DonationPost): void;

  publishFamilyInNeedPostCreated(familyInNeedPost: FamilyInNeedPost): void;

  publishDonationRequestPostCreated(donationRequestPost: DonationRequestPost): void;

  publishCallForHelpPostCreated(callForHelpPost: CallForHelpPost): void;
}
