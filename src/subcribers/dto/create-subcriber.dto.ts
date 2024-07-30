// create-job.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";

export class CreateSubcriberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true, message: "Skill must be string" })
  skills: string[];
}
