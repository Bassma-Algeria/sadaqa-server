interface DonationPayload {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly wilayaNumber: number;
    readonly pictures: string[];
    readonly status: string;
    readonly publisherId: string;
    readonly createdAt: Date;
}

interface DonationRequestPayload {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly wilayaNumber: number;
    readonly pictures: string[];
    readonly status: string;
    readonly publisherId: string;
    readonly createdAt: Date;
}

interface FamilyInNeedPostPayload {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly pictures: string[];
    readonly publisherId: string;
    readonly createdAt: Date;
    readonly status: string;
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}

interface CallForHelpPostPayload {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly pictures: string[];
    readonly publisherId: string;
    readonly createdAt: Date;
    readonly status: string;
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

interface FavouritePostPayload {
    readonly postId: string;
    readonly userId: string;
    readonly postType: string;
}

interface UserLoginPayload {
    readonly userId: string;
}

interface TextMessageSentPayload {
    messageId: string;
    senderId: string;
    content: string;
    receiverId: string;
    createdAt: Date;
    read: boolean;
}

interface MessageReadPayload {
    messageId: string;
}

export interface Events {
    USER_LOGIN: UserLoginPayload;
    ASSOCIATION_REGISTERED: AssociationRegisteredPayload;
    REGULAR_USER_REGISTERED: RegularUserRegisteredPayload;

    DONATION_POST_CREATED: DonationPayload;
    DONATION_POST_UPDATED: DonationPayload;
    DONATION_POST_DELETED: DonationPayload;
    DONATION_POST_ENABLING_STATUS_TOGGLED: DonationPayload;

    FAMILY_IN_NEED_POST_CREATED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_UPDATED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_DELETED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_ENABLING_STATUS_TOGGLED: FamilyInNeedPostPayload;

    CALL_FOR_HELP_POST_CREATED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_UPDATED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_DELETED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_ENABLING_STATUS_TOGGLED: CallForHelpPostPayload;

    DONATION_REQUEST_POST_CREATED: DonationRequestPayload;
    DONATION_REQUEST_POST_UPDATED: DonationRequestPayload;
    DONATION_REQUEST_POST_DELETED: DonationRequestPayload;
    DONATION_REQUEST_POST_ENABLING_STATUS_TOGGLED: DonationRequestPayload;

    POST_ADDED_TO_FAVOURITE: FavouritePostPayload;
    POST_DELETED_FROM_FAVOURITE: FavouritePostPayload;

    TEXT_MESSAGE_SENT: TextMessageSentPayload;
    MESSAGE_READ: MessageReadPayload;
}
