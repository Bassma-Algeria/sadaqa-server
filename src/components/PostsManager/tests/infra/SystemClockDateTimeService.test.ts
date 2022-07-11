import { expect } from 'chai';

import { SystemClockDateTimeService } from '../../main/infra/real/SystemClockDateTimeService';

describe('SystemClockDateTimeService', () => {
  const dateTimeService = new SystemClockDateTimeService();

  it('should give the current time', () => {
    expect(dateTimeService.now().toString()).to.equal(new Date().toString());
  });
});
