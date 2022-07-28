import { faker } from '@faker-js/faker';

const aTogglePostEnablingStatusRequest = (
  request?: Partial<{ userId: string; postId: string }>,
) => ({
  userId: faker.datatype.uuid(),
  postId: faker.datatype.uuid(),
  ...request,
});

export { aTogglePostEnablingStatusRequest };