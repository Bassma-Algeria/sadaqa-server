import { instance, mock, verify, when } from 'ts-mockito';

import { aDonationPost } from './base/aDonationPost';

import { EventBus } from '../../../_shared_/event-bus/EventBus';

import { PostsEventBusImpli } from '../../main/infra/real/PostsEventBusImpli';

describe('PostsEventBusImli', function () {
  const eventBusMock = mock<EventBus>();
  const postsEventBus = new PostsEventBusImpli(instance(eventBusMock));

  it('should notify the global event bus that the new post is created', () => {
    when(eventBusMock.publish('NEW_DONATION_CREATED')).thenReturn({
      withPayload: () => {},
    });

    postsEventBus.publishDonationPostCreated(aDonationPost());

    verify(eventBusMock.publish('NEW_DONATION_CREATED')).called();
  });
});