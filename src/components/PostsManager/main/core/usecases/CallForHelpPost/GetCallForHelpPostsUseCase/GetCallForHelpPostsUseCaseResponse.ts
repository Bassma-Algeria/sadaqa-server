export interface GetCallForHelpPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly callsForHelp: {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly publisherId: string;
    readonly pictures: string[];
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
    readonly createdAt: Date;
  }[];
}
