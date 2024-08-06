import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  permissions: Types.ObjectId[];
}
