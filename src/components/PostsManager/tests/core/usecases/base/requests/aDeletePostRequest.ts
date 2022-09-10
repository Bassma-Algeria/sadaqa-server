import { faker } from '@faker-js/faker';

const aDeletePostRequest = (
    request?: Partial<{ userId: string; postId: string }>,
): { userId: string; postId: string } => ({
    postId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    ...request,
});

export { aDeletePostRequest };
