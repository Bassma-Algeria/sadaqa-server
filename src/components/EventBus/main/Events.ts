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
    readonly ccp: { number: string; key: string } | null;
    readonly baridiMobNumber: string | null;
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
    readonly ccp: { number: string; key: string } | null;
    readonly baridiMobNumber: string | null;
}

interface AssociationRegisteredPayload {
    readonly accountId: string;
    readonly associationName: string;
    readonly wilayaNumber: number;
    readonly phoneNumber: string;
    readonly email: string;
    readonly status: string;
    readonly createdAt: Date;
    readonly associationDocs: { buffer: Buffer; filename: string }[];
}

interface RegularUserRegisteredPayload {
    readonly accountId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly wilayaNumber: number;
    readonly phoneNumber: string;
    readonly email: string;
    readonly status: string;
    readonly createdAt: Date;
}

interface FavouritePostPayload {
    readonly postId: string;
    readonly userId: string;
    readonly postType: string;
}

interface TextMessageSentPayload {
    readonly messageId: string;
    readonly senderId: string;
    readonly content: string;
    readonly receiverId: string;
    readonly createdAt: Date;
    readonly read: boolean;
}

interface MessageReadPayload {
    readonly senderId: string;
    readonly messageId: string;
    readonly receiverId: string;
}

interface RegularUserAccountInfoEdited {
    readonly accountId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly wilayaNumber: number;
    readonly phoneNumber: string;
}

interface AssociationAccountInfoEdited {
    readonly accountId: string;
    readonly associationName: string;
    readonly wilayaNumber: number;
    readonly phoneNumber: string;
}

interface PostNotificationPayload {
    readonly notificationId: string;
    readonly receiverId: string;
    readonly postId: string;
    readonly reason: string;
    readonly createdAt: Date;
}

interface TextMessageNotificationPayload {
    readonly notificationId: string;
    readonly receiverId: string;
    readonly messageContent: string;
    readonly messageSenderId: string;
    readonly createdAt: Date;
}

interface AssociationApprovalEmailPayload {
    readonly sender: string;
    readonly receiver: string;
    readonly associationId: string;
}

interface PostSharedPayload {
    readonly postId: string;
    readonly userId: string | null;
    readonly shareTime: Date;
}

export interface Events {
    USER_LOGIN: { accountId: string };
    ASSOCIATION_REGISTERED: AssociationRegisteredPayload;
    REGULAR_USER_REGISTERED: RegularUserRegisteredPayload;
    ASSOCIATION_ACCOUNT_INFO_EDITED: AssociationAccountInfoEdited;
    REGULAR_USER_ACCOUNT_INFO_EDITED: RegularUserAccountInfoEdited;
    ACCOUNT_CREDENTIALS_EDITED: { accountId: string };
    USER_GO_OFFLINE: { accountId: string };
    USER_BECAME_ONLINE: { accountId: string };

    DONATION_POST_SHARED: PostSharedPayload;
    DONATION_POST_CREATED: DonationPayload;
    DONATION_POST_UPDATED: DonationPayload;
    DONATION_POST_DELETED: DonationPayload;
    DONATION_POST_ENABLING_STATUS_TOGGLED: DonationPayload;

    FAMILY_IN_NEED_POST_SHARED: PostSharedPayload;
    FAMILY_IN_NEED_POST_CREATED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_UPDATED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_DELETED: FamilyInNeedPostPayload;
    FAMILY_IN_NEED_POST_ENABLING_STATUS_TOGGLED: FamilyInNeedPostPayload;

    CALL_FOR_HELP_POST_SHARED: PostSharedPayload;
    CALL_FOR_HELP_POST_CREATED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_UPDATED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_DELETED: CallForHelpPostPayload;
    CALL_FOR_HELP_POST_ENABLING_STATUS_TOGGLED: CallForHelpPostPayload;

    DONATION_REQUEST_POST_SHARED: PostSharedPayload;
    DONATION_REQUEST_POST_CREATED: DonationRequestPayload;
    DONATION_REQUEST_POST_UPDATED: DonationRequestPayload;
    DONATION_REQUEST_POST_DELETED: DonationRequestPayload;
    DONATION_REQUEST_POST_ENABLING_STATUS_TOGGLED: DonationRequestPayload;

    POST_ADDED_TO_FAVOURITE: FavouritePostPayload;
    POST_DELETED_FROM_FAVOURITE: FavouritePostPayload;

    MESSAGE_READ: MessageReadPayload;
    TEXT_MESSAGE_SENT: TextMessageSentPayload;
    USER_STOP_TYPING: { userId: string; receiverId: string };
    USER_START_TYPING: { userId: string; receiverId: string };

    NOTIFICATION_READ: { notificationId: string };
    NOTIFICATION_CLICKED: { notificationId: string };
    NEW_DONATION_POST_NOTIFICATION: PostNotificationPayload;
    NEW_CALL_FOR_HELP_POST_NOTIFICATION: PostNotificationPayload;
    NEW_TEXT_MESSAGE_NOTIFICATION: TextMessageNotificationPayload;
    NEW_FAMILY_IN_NEED_POST_NOTIFICATION: PostNotificationPayload;
    NEW_DONATION_REQUEST_POST_NOTIFICATION: PostNotificationPayload;

    ASSOCIATION_APPROVAL_EMAIL_SENT: AssociationApprovalEmailPayload;
}
