import { DonationPost } from '../../DonationPost';
import { PostEventPublisher } from './base/PostEventPublisher';

export interface DonationPostEventPublisher extends PostEventPublisher<DonationPost> {}
