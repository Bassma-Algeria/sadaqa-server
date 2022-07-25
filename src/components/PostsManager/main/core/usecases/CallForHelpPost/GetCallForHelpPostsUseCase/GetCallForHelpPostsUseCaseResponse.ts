import { CallForHelpPostDto } from '../../_common_/dtos/CallForHelpPostDto';

export interface GetCallForHelpPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly callsForHelp: CallForHelpPostDto[];
}
