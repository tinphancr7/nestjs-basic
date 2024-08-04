import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserCvDto } from "./dto/create-resume.dto";

import { Resume, ResumeDocument } from "./schemas/resume.schema";
import { IUser } from "src/users/users.interface";

import { toObjectId } from "src/utils";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { ResumeStatus } from "src/common/enum";
import { BaseService } from "src/base/base.service";

@Injectable()
export class ResumesService extends BaseService<ResumeDocument> {
  constructor(@InjectModel(Resume.name) private readonly resumeModel: SoftDeleteModel<ResumeDocument>) {
    super(resumeModel);
  }

  async create(createUserCvResumeDto: CreateUserCvDto, user: IUser) {
    const { url, company, job } = createUserCvResumeDto;

    const { email, _id } = user;
    return this.createData({
      url,
      company: toObjectId(company),
      job: toObjectId(job),
      email,
      userId: toObjectId(_id),
      status: ResumeStatus.PENDING,
      createdBy: toObjectId(_id),
      history: [
        {
          status: ResumeStatus.PENDING,
          updateAt: new Date(),
          updatedBy: toObjectId(_id),
        },
      ],
    });
  }

  async findAll({ page, limit }) {
    return this.findAllData({
      query: {
        page,
        limit,
      },
      populate: [{ path: "userId", select: { name: 1, role: 1, email: 1 } }, { path: "job" }, { path: "company" }],
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: { path: "createdBy" },
    });
  }

  async findByUser(user: IUser) {
    const resume = await this.resumeModel
      .find({
        userId: toObjectId(user._id),
      })
      .exec();
    return resume;
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    const { status } = updateResumeDto;
    return this.updateData({
      id,
      updateDto: {
        status,
        updatedBy: toObjectId(user._id),
        $push: {
          history: {
            status,
            updatedBy: toObjectId(user._id),
            updatedAt: new Date(),
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.removeData({
      id,
    });
  }
}
