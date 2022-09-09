import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LoginDto {
    @ApiProperty()
    readonly email!: string;

    @ApiProperty({ minLength: 6 })
    readonly password!: string;
}

class RegisterUserDto {
    @ApiProperty({ minLength: 3 })
    readonly firstName!: string;

    @ApiProperty({ minLength: 3 })
    readonly lastName!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty()
    readonly phoneNumber!: string;

    @ApiProperty()
    readonly email!: string;

    @ApiProperty({ minLength: 6 })
    readonly password!: string;

    @ApiProperty({ minLength: 6 })
    readonly confirmPassword!: string;
}

class RegisterAssociationDto {
    @ApiProperty({ minLength: 3 })
    associationName!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    wilayaNumber!: number;

    @ApiProperty()
    phoneNumber!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty({ minLength: 6 })
    password!: string;

    @ApiProperty({ minLength: 6 })
    confirmPassword!: string;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    associationDocs!: any[];
}

class EditAssociationInfoDto {
    @ApiProperty({ minLength: 3 })
    associationName!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    wilayaNumber!: number;

    @ApiProperty()
    phoneNumber!: string;

    @ApiPropertyOptional({
        description:
            "a real pic, or the url of the old pic, or don't send it at all, this will delete the profile picture if exist",
        oneOf: [{ type: 'string' }, { type: 'string', format: 'binary' }],
    })
    profilePicture?: string;
}

class EditRegularUserInfoDto {
    @ApiProperty({ minLength: 3 })
    firstName!: string;

    @ApiProperty({ minLength: 3 })
    lastName!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    wilayaNumber!: number;

    @ApiProperty()
    phoneNumber!: string;

    @ApiPropertyOptional({
        description:
            "a real pic, or the url of the old pic, or don't send it at all, this will delete the profile picture if exist",
        oneOf: [{ type: 'string' }, { type: 'string', format: 'binary' }],
    })
    profilePicture?: string;
}

class EditCredentialsDto {
    @ApiProperty()
    email!: string;

    @ApiProperty({ minLength: 6 })
    oldPassword!: string;

    @ApiProperty({ minLength: 6 })
    newPassword!: string;
}

export {
    LoginDto,
    RegisterUserDto,
    RegisterAssociationDto,
    EditAssociationInfoDto,
    EditRegularUserInfoDto,
    EditCredentialsDto,
};
