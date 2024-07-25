import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { Job, JobDocument } from "./schemas/job.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return await createdJob.save();
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.jobModel.find().skip(skip).limit(limit).lean().populate("").sort({ createdAt: "desc" });
    const totalItems = await this.jobModel.countDocuments();
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

  async findOne(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const updatedJob = await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true }).exec();
    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return updatedJob;
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobModel.findByIdAndDelete(id).exec();
    if (result === null) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }
}
