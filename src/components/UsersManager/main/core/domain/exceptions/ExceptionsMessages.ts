const ExceptionsMessages = {
  WRONG_CREDENTIALS: {
    en: 'wrong credentials, please try again',
    ar: 'لا يوجد حساب بالمعلومات ، يرجى المحاولة مرة أخرى',
  },
  INVALID_EMAIL: {
    en: 'invlid email format, please try again',
    ar: 'بريد إلكتروني غير صحيح ، يرجى المحاولة مرة أخرى',
  },
  SHORT_PASSWORD: {
    en: 'password should have more than 6 characters',
    ar: 'يجب أن تحتوي كلمة المرور على أكثر من 6 أحرف',
  },
  SHORT_NAME: {
    en: 'name should have more than 3 characters',
    ar: 'يجب أن يحتوي الاسم على أكثر من 3 أحرف',
  },
  INVALID_PHONE: {
    en: 'invlid phone number format, please try again',
    ar: 'رقم الهاتف غير صحيح ، يرجى المحاولة مرة أخرى',
  },
  INVALID_USER_ID: 'user id cannot be falsy',
};

export { ExceptionsMessages };
