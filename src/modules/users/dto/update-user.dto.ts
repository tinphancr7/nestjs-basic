import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ["password"] as const) {
  @IsNotEmpty()
  _id: string;
}
