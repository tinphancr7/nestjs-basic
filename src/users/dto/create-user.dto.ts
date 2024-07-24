import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "Password should be at least 6 characters",
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  age: string;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  role: string;
}
export class RegisterUserDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "Password should be at least 6 characters",
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  age: string;
}
