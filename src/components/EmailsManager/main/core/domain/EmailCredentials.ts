import { EmailAddress } from './EmailAddress';
import { EmailPassword } from './EmailPassword';

export interface EmailCredentials {
    email(): EmailAddress;

    password(): EmailPassword;
}
