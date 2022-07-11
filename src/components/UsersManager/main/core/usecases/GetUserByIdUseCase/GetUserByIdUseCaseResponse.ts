export interface GetUserByIdUseCaseResponse {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly wilayaNumber: number;
  readonly phoneNumber: string;
  readonly email: string;
  readonly createdAt: Date;
}
