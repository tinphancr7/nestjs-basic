import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resume, ResumeSchema } from "./schemas/resume.schema";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { CaslModule } from "src/casl/casl.module";
// Import UsersModule to use its services, controllers, etc.
@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]), CaslModule],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
