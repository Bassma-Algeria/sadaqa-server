import { UseCase } from '../UseCase';
import { LoginUseCaseRequest } from './LoginUseCaseRequest';
import { LoginUseCaseResponse } from './LoginUseCaseResponse';

import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';

import { PasswordEncryptor } from '../../domain/services/PasswordEncryptor';
import { UserAccountRepository } from '../../domain/services/UserAccountRepository';

import { WrongCredentialsException } from '../../domain/exceptions/WrongCredentialsException';

class LoginUseCase implements UseCase<LoginUseCaseRequest, LoginUseCaseResponse> {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {}

  async handle(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const email = new Email(request.email);

    const account = await this.findUserByEmail(email);
    if (!account) throw new WrongCredentialsException();

    const isMatch = await this.checkPassword(request.password, account.password);
    if (!isMatch) throw new WrongCredentialsException();

    return { userId: account.userId.value() };
  }

  private async checkPassword(plain: string, encrypted: Password) {
    const plainPassword = new Password(plain);
    const isCorrectPassword = await this.passwordEncryptor.compare(plainPassword, encrypted);

    return isCorrectPassword;
  }

  private findUserByEmail(email: Email) {
    return this.userAccountRepository.findByEmail(email);
  }
}

export { LoginUseCase };
