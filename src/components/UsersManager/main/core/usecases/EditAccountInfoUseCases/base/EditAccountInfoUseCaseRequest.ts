export interface EditAccountInfoUseCaseRequest {
    readonly accountId: string;
    readonly phoneNumber: string;
    readonly wilayaNumber: number;
    readonly profilePicture: null | string | { buffer: Buffer; filename: string };
}
