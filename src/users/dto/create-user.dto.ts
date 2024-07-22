import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({
    message: "Email should not be empty",
  })
  email: string;

  @IsNotEmpty({
    message: "Password should not be empty",
  })
  @MinLength(6, {
    message: "Password should be at least 6 characters",
  })
  password: string;

  name: string;

  address: string;
}
