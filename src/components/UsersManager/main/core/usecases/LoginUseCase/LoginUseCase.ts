import { UseCase } from '../UseCase';
import { LoginUseCaseRequest } from './LoginUseCaseRequest';
import { LoginUseCaseResponse } from './LoginUseCaseResponse';

import { Email } from '../../domain/Email';
import { UserId } from '../../domain/UserId';
import { Password } from '../../domain/Password';

import { UsersEventBus } from '../../domain/services/UsersEventBus';
import { PasswordEncryptor } from '../../domain/services/PasswordEncryptor';
import { RegularUserAccountRepository } from '../../domain/services/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../domain/services/AssociationAccountRepository';

import { WrongCredentialsException } from '../../domain/exceptions/WrongCredentialsException';

class LoginUseCase implements UseCase<LoginUseCaseRequest, LoginUseCaseResponse> {
  constructor(
    private readonly regularUserAccountRepository: RegularUserAccountRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly associationAccountRepository: AssociationAccountRepository,
    private readonly usersEventBus: UsersEventBus,
  ) {}

  async handle(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const { password: passwordFromRequest, email } = this.getFrom(request);

    const { password: realPassword, userId } = await this.findTargetAccountAndThrowIfNotExist(
      email,
    );

    await this.checkIfPasswordsMatchAndThrowIfNot(passwordFromRequest, realPassword);

    this.usersEventBus.publishUserLoginEvent(userId);

    return { userId: userId.value() };
  }

  private getFrom(request: LoginUseCaseRequest) {
    return { email: new Email(request.email), password: new Password(request.password) };
  }

  private async findTargetAccountAndThrowIfNotExist(email: Email) {
    let userId: UserId;
    let password: Password;

    const regularUser = await this.regularUserAccountRepository.findByEmail(email);

    if (regularUser) {
      userId = regularUser.userId;
      password = regularUser.password;
    } else {
      const association = await this.associationAccountRepository.findByEmail(email);
      if (!association) throw new WrongCredentialsException();

      userId = association.associationId;
      password = association.password;
    }

    return { password, userId };
  }

  private async checkIfPasswordsMatchAndThrowIfNot(
    passwordFromRequest: Password,
    realPassword: Password,
  ) {
    const isMatch = await this.passwordEncryptor.compare(passwordFromRequest, realPassword);
    if (!isMatch) throw new WrongCredentialsException();
  }
}

export { LoginUseCase };
