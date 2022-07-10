const ExceptionsMessages = {
  SHORT_TITLE: {
    en: 'title should have more than 3 characters',
    ar: 'يجب أن يحتوي العنوان على أكثر من 3 أحرف',
  },

  INVALID_CCP: {
    en: 'invalid ccp/ccp-key number, please try again',
    ar: 'رقم مفتاح ccp أو ccp غير صالح ، يرجى المحاولة مرة أخرى',
  },

  INVALID_RIB: {
    en: 'invalid dahabia rib number, please try again',
    ar: 'رقم البطاقة الدهبية غير صالح ، يرجى المحاولة مرة أخرى',
  },

  POST_TYPE_NOT_SUPPORTED:
    'the post type is not supported, check the docs to see the supported types',
  PUBLISHER_ID_NOT_VALID: 'publisher id not valid',
  INVALID_WILAYA_NUMBER: 'this wilaya number is not valid, please try another one',
  CATEGORY_NOT_SUPPORTED:
    'the category is not supported, check the docs to see the supported categories for this type',
  TYPE_HAVE_NO_CATEGORIES: "this post type didn't support any categories",
  NOT_AUTHORIZED_TO_PUBLISH_THIS_TYPE: "sorry, you're not authorize to publish this post type",
  INVALID_PICTURE_URL: 'invalid picture url',
  INVALID_POST_ID: 'invalid post id',
};

export { ExceptionsMessages };
