export interface RegisterAssociationUseCaseRequest {
  associationName: string;
  wilayaNumber: number;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  associationDocs: Buffer[];
}