import { faker } from '@faker-js/faker';
import { DateTimeService } from '../../core/domain/services/DateTimeService';

class FakeDateTimeService implements DateTimeService {
  now(): Date {
    return faker.date.recent();
  }
}
export { FakeDateTimeService };
