import { ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  readonly password: string;
}

class RegisterUserDto {
  @ApiProperty({ minLength: 3 })
  readonly firstName: string;

  @ApiProperty({ minLength: 3 })
  readonly lastName: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber: number;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  readonly password: string;

  @ApiProperty({ minLength: 6 })
  readonly confirmPassword: string;
}

export { LoginDto, RegisterUserDto };