// create-resume.dto.ts
import { IsNotEmpty, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateResumeDto {
  @IsNotEmpty()
  url: string;

  @IsMongoId()
  @IsNotEmpty()
  companyId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  jobId: Types.ObjectId;
}
export class CreateUserCvDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsMongoId()
  company: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  job: Types.ObjectId;
}
