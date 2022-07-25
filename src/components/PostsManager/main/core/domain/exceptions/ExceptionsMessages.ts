const ExceptionsMessages = {
  SHORT_TITLE: {
    en: 'title should have more than 3 characters',
    ar: 'يجب أن يحتوي العنوان على أكثر من 3 أحرف',
  },

  INVALID_CCP: {
    en: 'invalid ccp/ccp-key number, please try again',
    ar: 'رقم مفتاح ccp أو ccp غير صالح ، يرجى المحاولة مرة أخرى',
  },

  INVALID_BARIDI_MOB_NUMBER: {
    en: 'invalid baridi mob number, please try again',
    ar: 'رقم بريدي موب غير صالح ، يرجى المحاولة مرة أخرى',
  },

  INVALID_POST_TYPE: 'the post type is not valid, check the docs to see the valid types',
  USER_ID_NOT_VALID: 'publisher id not valid',
  INVALID_WILAYA_NUMBER: {
    en: 'this wilaya number is not valid, please try another one',
    ar: 'رقم الولاية غير صالح ، يرجى تجربة رقم آخر',
  },
  CATEGORY_NOT_SUPPORTED:
    'the category is not supported, check the docs to see the supported categories for this type',
  TYPE_HAVE_NO_CATEGORIES: "this post type didn't support any categories",
  NOT_AUTHORIZED_TO_PUBLISH_THIS_TYPE: "sorry, you're not authorize to publish this post",
  INVALID_PICTURE_URL: 'invalid picture url',
  INVALID_POST_ID: 'invalid post id',
  POST_NOT_FOUND: 'no post found',
  NEGATIVE_LIKES_COUNT: 'likes count cannot be negative',
  POST_ALREADY_LIKED: 'you already liked this post',
  USER_NOT_EXIST: 'user not exist',
  POST_NOT_LIKED: "you didn' like this post yet",
};

export { ExceptionsMessages };
