import { Module } from "@nestjs/common";
import { ResumeService } from "./resume.service";
import { ResumeController } from "./resume.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Resume, ResumeSchema } from "./schemas/resume.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
