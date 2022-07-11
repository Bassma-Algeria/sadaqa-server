import { DateTimeService } from '../../core/domain/services/DateTimeService';

class SystemClockDateTimeService implements DateTimeService {
  now(): Date {
    return new Date();
  }
}

export { SystemClockDateTimeService };
