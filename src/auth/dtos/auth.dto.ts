import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServiceProviderUserSignupDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  phoneCodeId: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // TODO: Implement password policy
  @IsNotEmpty()
  @IsString()
  password: string;
}
