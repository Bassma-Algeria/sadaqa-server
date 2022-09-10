export interface RegisterUseCaseRequest {
    readonly phoneNumber: string;
    readonly wilayaNumber: number;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
}