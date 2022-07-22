interface RegisterRegularUserUseCaseRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly wilayaNumber: number;
  readonly phoneNumber: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export { RegisterRegularUserUseCaseRequest };
