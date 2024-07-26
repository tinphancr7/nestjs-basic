import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserCvDto } from "./dto/create-resume.dto";

import { Resume, ResumeDocument } from "./schemas/resume.schema";
import { IUser } from "src/users/users.interface";

import { toObjectId } from "src/utils";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { ResumeStatus } from "src/common/enum";

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private readonly resumeModel: SoftDeleteModel<ResumeDocument>) {}

  async create(createUserCvResumeDto: CreateUserCvDto, user: IUser) {
    const { url, company, job } = createUserCvResumeDto;

    const { email, _id } = user;
    const newCV: any = await this.resumeModel.create({
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
    return {
      _id: newCV._id,
      createdAt: newCV.createdAt,
    };
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.resumeModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("")
      .sort({ createdAt: "desc" });
    const totalItems = await this.resumeModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      meta: {
        current: page, // trang hiện tại
        pageSize: limit, // số lượng bản ghi đã lấy
        pages: totalPages, // tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, // kết quả query
    };
  }

  async findOne(id: string) {
    const resume = await this.resumeModel.findById(id).exec();
    if (!resume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
    return resume;
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
    const updatedResume = await this.resumeModel
      .findByIdAndUpdate(
        id,
        {
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
        { new: true },
      )
      .exec();
    if (!updatedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
    return updatedResume;
  }

  async remove(id: string): Promise<void> {
    const deletedResume = await this.resumeModel.findByIdAndDelete(id).exec();
    if (!deletedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
  }
}
