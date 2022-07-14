const EndPoints = {
  REGISTER: '/api/users/register',
  NEW_DONATION: '/api/posts/donations',
  GET_DONATION: (id: string) => `/api/posts/donations/${id}`,
  GET_DONATIONS: ({ category }: { category: string }) =>
    `/api/posts/donations?category=${category}`,
};

export { EndPoints };
