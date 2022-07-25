import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';

describe('Get Favourite Posts', () => {
  const mockUsersService = mock<UsersService>();
  const postsManager = aPostsManagerFacade({ usersService: instance(mockUsersService) });

  beforeEach(async () => {
    when(mockUsersService.isExist(anything())).thenResolve(true);
  });

  it('given a request to get the favourite posts, when the user id provided is not an account id, then should fail', async () => {
    when(mockUsersService.isExist(anything())).thenResolve(false);

    const NOT_EXISTING_USER_ID = faker.datatype.uuid();

    await expect(postsManager.getFavouritePosts({ userId: NOT_EXISTING_USER_ID }))
      .to.eventually.be.rejectedWith(ExceptionsMessages.USER_NOT_EXIST)
      .and.be.and.instanceOf(ValidationException);
  });
});