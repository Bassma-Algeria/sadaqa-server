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

    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new WrongCredentialsException();

    const plainPassword = new Password(request.password);
    const encrypedPassword = user.password;

    const isCorrectPassword = await this.passwordEncryptor.compare(plainPassword, encrypedPassword);
    if (!isCorrectPassword) throw new WrongCredentialsException();

    return { userId: user.userId.value() };
  }
}

export { LoginUseCase };
