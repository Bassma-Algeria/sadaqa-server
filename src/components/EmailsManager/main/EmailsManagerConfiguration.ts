import { EmailsManagerFacade } from './EmailsManagerFacade';

class EmailsManagerConfiguration {
    static anEmailsManager() {
        return new EmailsManagerFacade();
    }
}

export { EmailsManagerConfiguration };
