const EndPoints = {
  REGISTER_USER: '/api/users/regular-user/register',
  NEW_DONATION: '/api/posts/donations',
  GET_DONATION: (id: string) => `/api/posts/donations/${id}`,
  GET_DONATIONS: ({ category }: { category: string }) =>
    `/api/posts/donations?category=${category}`,
  GET_FAMILY_IN_NEED: (id: string) => `/api/posts/families-in-need/${id}`,
  GET_FAMILIES_IN_NEED: '/api/posts/families-in-need',
  NEW_FAMILY_IN_NEED: '/api/posts/families-in-need',
  ACTIVATE_ASSOCIATION: (id: string) => `/admin/associations/${id}/activate`,
  GET_AUTHENTICATED_ASSOCIATION: '/api/users/associations/me',
  REGISTER_ASSOCIATION: '/api/users/associations/register',
  GET_DONATION_REQUESTS: '/api/posts/donation-requests',
  NEW_DONATION_REQUEST: '/api/posts/donation-requests',
  GET_DONATION_REQUEST: (id: string) => `/api/posts/donation-requests/${id}`,
  GET_CALLS_FOR_HELP: '/api/posts/calls-for-help',
  NEW_CALL_FOR_HELP: '/api/posts/calls-for-help',
  GET_CALL_FOR_HELP: (id: string) => `/api/posts/calls-for-help/${id}`,
};

export { EndPoints };
