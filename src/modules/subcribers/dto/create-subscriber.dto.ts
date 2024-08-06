// create-job.dto.ts
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreateSubscriberDto {
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
