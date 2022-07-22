export interface GetAssociationByIdUseCaseResponse {
  readonly associationId: string;
  readonly associationName: string;
  readonly wilayaNumber: number;
  readonly phoneNumber: string;
  readonly email: string;
  readonly active: boolean;
  readonly createdAt: Date;
}