import { Password } from '../Password';

export interface PasswordEncryptor {
  encrypt(password: Password): Promise<Password>;
  compare(plain: Password, encrypted: Password): Promise<boolean>;
}
