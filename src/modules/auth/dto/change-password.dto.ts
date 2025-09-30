import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    },
  )
  newPassword: string;
}
