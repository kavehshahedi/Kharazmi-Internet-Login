module.exports = {
    jwtSecretKey: 'SuXycuxji:(BYL7(?K3X2',

    defaultUserName: 'کاربر مهمان',

    errors: {
        generalError: 'خطایی رخ داد. دوباره تلاش کنید.',

        auth: {
            notAuthorized: 'درخواست معتبر نیست.',
            userNotFound: 'کاربر پیدا نشد.',
            InvalidAccessToken: 'کد دسترسی شما اشتباه است!',
            notVerified: 'شما احراز هویت پیامکی نکرده‌اید',
            lessThanReRequestTime: 'برای ارسال کد تایید جدید باید حداقل یک دقیقه صبر کنید.',
            noVerifyObject: 'کد تاییدی برای شماره شما وجود ندارد.'
        },

        app: {
            publicationNotFound: 'نشریه مورد نظر پیدا نشد.',
            alreadyAddedInFavorites: 'نشریه مورد نظر قبلا نشان شده است.',
            notExistsInFavorites: 'نشریه مورد نظر در لیست نشان‌شده‌ها وجود ندارد.'
        },

        profile: {
            invalidName: 'نام انتخاب شده معتبر نیست.'
        }
    }
}