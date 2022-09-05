import { EmailsManagerFacade } from './EmailsManagerFacade';

import { FakeEmailService } from './infra/fake/FakeEmailService';

import { NodemailerEmailService } from './infra/real/NodemailerEmailService';
import { EmailEventPublisherImpl } from './infra/real/EmailEventPublisherImpl';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';

class EmailsManagerConfiguration {
    static anEmailsManager() {
        return new EmailsManagerFacade(
            this.getEmailService(),
            new EmailEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }

    private static getEmailService() {
        const env = process.env.NODE_ENV;

        if (env === 'production') return new NodemailerEmailService();
        else return new FakeEmailService();
    }
}

export { EmailsManagerConfiguration };
