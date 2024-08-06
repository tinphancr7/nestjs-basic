import { IsEnum, IsNotEmpty } from "class-validator";
import { ResumeStatus } from "src/common/enum";

export class UpdateResumeDto {
  @IsEnum(ResumeStatus)
  @IsNotEmpty()
  status: ResumeStatus;
}
