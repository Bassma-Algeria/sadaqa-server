interface DonationCreatedPayload {
  readonly postId: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly wilayaNumber: number;
  readonly pictures: string[];
  readonly publisherId: string;
  readonly createdAt: Date;
}

interface DonationRequestCreatedPayload {
  readonly postId: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly wilayaNumber: number;
  readonly pictures: string[];
  readonly publisherId: string;
  readonly createdAt: Date;
}

interface FamilyInNeedPostCreatedPayload {
  readonly postId: string;
  readonly title: string;
  readonly description: string;
  readonly wilayaNumber: number;
  readonly pictures: string[];
  readonly publisherId: string;
  readonly createdAt: Date;
  readonly ccp?: string;
  readonly ccpKey?: string;
  readonly baridiMobNumber?: string;
}

interface CallForHelpPostCreatedPayload {
  readonly postId: string;
  readonly title: string;
  readonly description: string;
  readonly wilayaNumber: number;
  readonly pictures: string[];
  readonly publisherId: string;
  readonly createdAt: Date;
  readonly ccp?: string;
  readonly ccpKey?: string;
  readonly baridiMobNumber?: string;
}

interface AssociationRegisteredPayload {
  readonly associationId: string;
  readonly associationName: string;
  readonly wilayaNumber: number;
  readonly phoneNumber: string;
  readonly email: string;
  readonly password: string;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly associationDocs: Buffer[];
}

interface RegularUserRegisteredPayload {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly wilayaNumber: number;
  readonly phoneNumber: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;
}

interface UserLoginPayload {
  readonly userId: string;
}

export interface Events {
  NEW_DONATION_POST_CREATED: DonationCreatedPayload;
  NEW_FAMILY_IN_NEED_POST_CREATED: FamilyInNeedPostCreatedPayload;
  NEW_CALL_FOR_HELP_POST_CREATED: CallForHelpPostCreatedPayload;
  NEW_ASSOCIATION_REGISTERED: AssociationRegisteredPayload;
  NEW_REGULAR_USER_REGISTERED: RegularUserRegisteredPayload;
  USER_LOGIN: UserLoginPayload;
  NEW_DONATION_REQUEST_POST_CREATED: DonationRequestCreatedPayload;
}
