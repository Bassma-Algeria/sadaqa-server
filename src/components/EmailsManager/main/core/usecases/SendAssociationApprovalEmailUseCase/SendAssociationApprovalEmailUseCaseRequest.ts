export interface SendAssociationApprovalEmailUseCaseRequest {
    accountId: string;
    associationName: string;
    wilayaNumber: number;
    phoneNumber: string;
    email: string;
    associationDocs: Buffer[];
}
