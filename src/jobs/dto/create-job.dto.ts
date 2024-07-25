// create-job.dto.ts
import { IsString, IsNumber, IsDate, IsBoolean, IsNotEmpty, IsOptional, IsArray, isString } from "class-validator";
import { Type } from "class-transformer";
// class CompanyDto {
//     @IsString()
//     @IsNotEmpty()
//     id: string;

//     @IsString()
//     @IsNotEmpty()
//     name: string;
//   }
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true, message: "skill must be string" })
  skills: string[];

  //   @IsObject()
  //   @ValidateNested()
  //   @Type(() => CompanyDto)
  //   company: CompanyDto;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  salary: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
