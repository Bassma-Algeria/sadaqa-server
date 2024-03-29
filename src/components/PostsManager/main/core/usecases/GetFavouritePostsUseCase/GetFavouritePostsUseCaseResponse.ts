import { DonationPostDto } from '../_common_/dtos/DonationPostDto';
import { CallForHelpPostDto } from '../_common_/dtos/CallForHelpPostDto';
import { FamilyInNeedPostDto } from '../_common_/dtos/FamilyInNeedPostDto';
import { DonationRequestPostDto } from '../_common_/dtos/DonationRequestPostDto';

export interface GetFavouritePostsUseCaseResponse {
    donation: DonationPostDto[];
    donationRequest: DonationRequestPostDto[];
    familyInNeed: FamilyInNeedPostDto[];
    callForHelp: CallForHelpPostDto[];
}
