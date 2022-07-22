export interface CreateFamilyInNeedPostUseCaseRequest {
  readonly title: string;
  readonly description: string;
  readonly wilayaNumber: number;
  readonly publisherId: string;
  readonly pictures: Buffer[];
  readonly ccp?: string;
  readonly ccpKey?: string;
  readonly baridiMobNumber?: string;
}