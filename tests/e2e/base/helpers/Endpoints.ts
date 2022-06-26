const EndPoints = {
  REGISTER: '/api/users/register',
  PUBLISH_POST: '/api/posts',
  GET_DONATIONS: '/api/posts?category=donations',
  GET_POST: (id: string) => `/api/posts/${id}`,
};

export { EndPoints };
