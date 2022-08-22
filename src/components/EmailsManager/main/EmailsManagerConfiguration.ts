import { EmailsManagerFacade } from './EmailsManagerFacade';

import { NodemailerEmailService } from './infra/real/NodemailerEmailService';
import { EmailEventPublisherImpl } from './infra/real/EmailEventPublisherImpl';

import { EventBus } from '../../_shared_/event-bus/EventBus';
import { FakeEmailService } from './infra/fake/FakeEmailService';

class EmailsManagerConfiguration {
    static anEmailsManager() {
        return new EmailsManagerFacade(
            this.getEmailService(),
            new EmailEventPublisherImpl(EventBus.getInstance()),
        );
    }

    private static getEmailService() {
        const env = process.env.NODE_ENV;

        if (env === 'production') return new NodemailerEmailService();
        else return new FakeEmailService();
    }
}

export { EmailsManagerConfiguration };
