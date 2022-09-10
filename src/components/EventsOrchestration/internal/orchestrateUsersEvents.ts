import { handleError } from '../handleError';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { EmailsManagerConfiguration } from '../../EmailsManager/main/EmailsManagerConfiguration';

const orchestrateUsersEvents = () => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('ASSOCIATION_REGISTERED').by(payload => {
        EmailsManagerConfiguration.anEmailsManager()
            .sendAssociationApprovalEmail(payload)
            .catch(e =>
                handleError('Error while Sending the Association Approval Request Email', e),
            );
    });
};

export { orchestrateUsersEvents };
