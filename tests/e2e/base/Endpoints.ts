const EndPoints = {
    REGISTER_USER: '/api/users/regular-user/register',
    NEW_DONATION: '/api/posts/donation',
    GET_DONATION: (id: string) => `/api/posts/donation/${id}`,
    GET_DONATIONS: ({ category }: { category: string }) =>
        `/api/posts/donation?category=${category}`,
    GET_FAMILY_IN_NEED: (id: string) => `/api/posts/family-in-need/${id}`,
    GET_FAMILIES_IN_NEED: '/api/posts/family-in-need',
    NEW_FAMILY_IN_NEED: '/api/posts/family-in-need',
    ACTIVATE_ASSOCIATION: (id: string) => `/admin/associations/${id}/activate`,
    GET_AUTHENTICATED_ASSOCIATION: '/api/users/associations/me',
    REGISTER_ASSOCIATION: '/api/users/associations/register',
    GET_DONATION_REQUESTS: '/api/posts/donation-request',
    NEW_DONATION_REQUEST: '/api/posts/donation-request',
    GET_DONATION_REQUEST: (id: string) => `/api/posts/donation-request/${id}`,
    GET_CALLS_FOR_HELP: '/api/posts/call-for-help',
    NEW_CALL_FOR_HELP: '/api/posts/call-for-help',
    GET_CALL_FOR_HELP: (id: string) => `/api/posts/call-for-help/${id}`,
};

export { EndPoints };
