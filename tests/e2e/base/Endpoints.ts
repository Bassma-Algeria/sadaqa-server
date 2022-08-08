const EndPoints = {
    REGISTER_REGULAR_USER: '/api/users/regular-user/register',
    EDIT_REGULAR_USER_INFO: '/api/users/regular-user/info',
    EDIT_ASSOCIATION_INFO: '/api/users/associations/info',
    GET_REGULAR_USER_BY_TOKEN: '/api/users/regular-user/me',
    GET_ASSOCIATION_BY_TOKEN: '/api/users/associations/me',
    NEW_DONATION: '/api/posts/donation',
    GET_DONATION: (id: string) => `/api/posts/donation/${id}`,
    GET_DONATIONS: `/api/posts/donation`,
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
    ADD_TO_FAVOURITE: `/api/posts/favourite`,
    GET_FAVOURITES: `/api/posts/favourite`,
    DELETE_FROM_FAVOURITE: (postType: string, id: string) =>
        `/api/posts/favourite?postType=${postType}&postId=${id}`,
};

export { EndPoints };
