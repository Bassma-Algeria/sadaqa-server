import { CallForHelpPostDto } from '../../_common_/dtos/CallForHelpPostDto';
import { GetPostsListUseCaseResponse } from '../base/GetPostsListUseCaseResponse';

export interface GetCallForHelpPostsListUseCaseResponse
    extends GetPostsListUseCaseResponse<CallForHelpPostDto> {}
