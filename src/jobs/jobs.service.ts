import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { Job, JobDocument } from "./schemas/job.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { BaseService } from "src/base/base.service";
import { toObjectId } from "src/utils";
import { IUser } from "src/users/users.interface";

@Injectable()
export class JobsService extends BaseService<JobDocument> {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) {
    super(jobModel);
  }

  async create(createJobDto: CreateJobDto, user: IUser) {
    return this.createData({
      ...createJobDto,
      createdBy: toObjectId(user?._id),
    });
  }

  async findAll({ page, limit }) {
    return this.findAllData({
      query: {
        page,
        limit,
      },
      populate: [
        { path: "createdBy", select: { name: 1, role: 1, email: 1 } },
        {
          path: "company",
          select: { name: 1, logo: 1, address: 1 },
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [
        { path: "createdBy", select: { name: 1, role: 1, email: 1 } },
        {
          path: "company",
          select: { name: 1, logo: 1, address: 1 },
        },
      ],
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updateJobDto,
        updatedBy: toObjectId(user?._id),
      },
    });
  }

  async remove(id: string) {
    return this.removeData({
      id,
    });
  }
}
