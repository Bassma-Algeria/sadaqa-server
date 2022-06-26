import { UseCase } from '../UseCase';
import { LoginUseCaseRequest } from './LoginUseCaseRequest';
import { LoginUseCaseResponse } from './LoginUseCaseResponse';

import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';

import { UsersRepository } from '../../domain/UsersRepository';
import { PasswordEncryptor } from '../../domain/PasswordEncryptor';

import { WrongCredentialsException } from '../../domain/exceptions/WrongCredentialsException';

class LoginUseCase implements UseCase<LoginUseCaseRequest, LoginUseCaseResponse> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {}

  async handle(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const email = new Email(request.email);

    const user = await this.findUserByEmail(email);
    if (!user) throw new WrongCredentialsException();

    const isCorrectPassword = await this.checkPasswordCorrecteness(request.password, user.password);
    if (!isCorrectPassword) throw new WrongCredentialsException();

    return { userId: user.userId.value() };
  }

  private async checkPasswordCorrecteness(plain: string, encrypted: Password) {
    const plainPassword = new Password(plain);
    const isCorrectPassword = await this.passwordEncryptor.compare(plainPassword, encrypted);

    return isCorrectPassword;
  }

  private findUserByEmail(email: Email) {
    return this.usersRepository.findByEmail(email);
  }
}

export { LoginUseCase };
