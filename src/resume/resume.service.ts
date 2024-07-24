import { Injectable } from "@nestjs/common";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Resume, ResumeDocument } from "./schemas/resume.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private companyModel: SoftDeleteModel<ResumeDocument>) {}
  create(createResumeDto: CreateResumeDto) {
    return "This action adds a new resume";
  }

  findAll() {
    return `This action returns all resume`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
