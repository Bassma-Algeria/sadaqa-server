const EndPoints = {
  REGISTER: '/api/users/register',
  NEW_DONATION: '/api/posts/donation',
  GET_DONATIONS: '/api/posts/donation',
  GET_DONATION: (id: string) => `/api/posts/donation/${id}`,
};

export { EndPoints };
