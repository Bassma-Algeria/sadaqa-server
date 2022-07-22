import { ApiProperty } from '@nestjs/swagger';

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

export { LoginDto, RegisterUserDto, RegisterAssociationDto };
