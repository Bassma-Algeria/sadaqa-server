import { HttpException, HttpStatus } from '@nestjs/common';

import {
    MultiLanguagesValidationException,
    SupportedLanguages,
} from '../../../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesValidationException';
import { ValidationException } from '../../../../../components/PostsManager/main/core/domain/exceptions/ValidationException';

import { NotFoundException } from '../../../../../components/PostsManager/main/core/domain/exceptions/NotFoundException';
import { TokenException } from '../../../../../components/AuthenticationManager/main/core/domain/exception/TokenException';
import { AuthorizationException } from '../../../../../components/PostsManager/main/core/domain/exceptions/AuthorizationException';

class PostsController {
    static handleException(e: unknown, language?: SupportedLanguages): never {
        if (e instanceof MultiLanguagesValidationException)
            throw new HttpException({ error: e.errorMessage[language!] }, HttpStatus.BAD_REQUEST);
        if (e instanceof ValidationException)
            throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);
        if (e instanceof TokenException)
            throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
        if (e instanceof NotFoundException)
            throw new HttpException({ error: e.message }, HttpStatus.NOT_FOUND);
        if (e instanceof AuthorizationException)
            throw new HttpException({ error: e.message }, HttpStatus.FORBIDDEN);

        throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export { PostsController };