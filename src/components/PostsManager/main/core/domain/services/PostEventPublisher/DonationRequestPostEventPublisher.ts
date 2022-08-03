import { DonationRequestPost } from '../../DonationRequestPost';
import { PostEventPublisher } from './base/PostEventPublisher';

export interface DonationRequestPostEventPublisher
    extends PostEventPublisher<DonationRequestPost> {}
