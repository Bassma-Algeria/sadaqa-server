export interface EditAccountCredentialsUseCaseRequest {
    accountId: string;
    email: string;
    oldPassword: string;
    newPassword: string;
}