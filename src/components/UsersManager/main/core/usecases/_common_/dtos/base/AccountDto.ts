export interface AccountDto {
    readonly accountId: string;
    readonly phoneNumber: string;
    readonly wilayaNumber: number;
    readonly profilePicture: string | null;
    readonly email: string;
    readonly status: string;
    readonly createdAt: Date;
}
