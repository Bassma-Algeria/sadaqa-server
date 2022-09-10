import { expect } from 'chai';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

import { NotificationId } from '../../../main/core/domain/NotificationId';

describe('Notification Id value object', () => {
    it('should not accept white string as an id', () => {
        expect(() => new NotificationId(''))
            .to.throws(ExceptionMessages.INVALID_NOTIFICATION_ID)
            .instanceof(ValidationException);
    });
});