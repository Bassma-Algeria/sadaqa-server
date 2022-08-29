const ExceptionMessages = {
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
    EMAIL_ALREADY_USED: {
        en: 'this email is used by another user, please try to register with another email',
        ar: 'هذا البريد الإلكتروني مستخدم من قبل مستعمل آخر ، يرجى محاولة التسجيل باستخدام بريد إلكتروني آخر',
    },
    NO_ASSOCIATION_DOCS: {
        en: 'should provide at least one legal document of your association',
        ar: 'يجب أن تقدم وثيقة قانونية واحدة على الأقل',
    },
    PHONE_NUMBER_ALREADY_USED: {
        en: 'this phone number is used by another user, please try to register with another one',
        ar: 'رقم الهاتف مستخدم من قبل مستخدم آخر ، يرجى محاولة التسجيل برقم آخر',
    },
    INVALID_WILAYA_NUMBER: {
        en: 'this wilaya does not exist, please try another one',
        ar: 'هذه الولاية غير موجودة ، يرجى تجربة ولاية أخرى',
    },
    PASSWORD_MISS_MATCH: {
        en: 'confirm password should match the password',
        ar: 'يجب أن يتطابق تأكيد كلمة المرور مع كلمة المرور',
    },
    WRONG_OLD_PASSWORD: {
        en: 'wrong old password',
        ar: 'كلمة المرور القديمة خاطئة',
    },
    INVALID_ACCOUNT_ID: 'invalid account id',
    ACCOUNT_NOT_FOUND: 'user not found',
    PROFILE_PIC_SENT_NOT_THE_OLD_PIC: 'profile picture sent is not the old picture',
    INVALID_PROFILE_PICTURE: 'profile picture url is not valid',
    NO_PROFILE_PICTURE_TO_DELETE: 'no profile picture to delete',
};

export { ExceptionMessages };
