import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { PublisherId } from '../../main/core/domain/PublisherId';
import { UsersManagerUsersService } from '../../main/infra/real/UsersManagerUsersService';

import { UsersManagerFacade } from '../../../UsersManager/main/UsersManagerFacade';

describe('UsersManagerUsersService', () => {
  const EXISTING_USER_ID = 'some exsiting user id';
  const NON_EXISTING_USER_ID = 'some none exsiting user id';

  const usersManagerMock = mock<UsersManagerFacade>();
  const usersService = new UsersManagerUsersService(instance(usersManagerMock));

  it('should return true when the user found', async () => {
    when(usersManagerMock.getUserById(anything())).thenResolve();

    await expect(usersService.isExist(new PublisherId(EXISTING_USER_ID))).to.eventually.equal(true);
  });

  it('should return false when the user not found', async () => {
    when(usersManagerMock.getUserById(anything())).thenReject();

    await expect(usersService.isExist(new PublisherId(NON_EXISTING_USER_ID))).to.eventually.equal(
      false,
    );
  });
});
