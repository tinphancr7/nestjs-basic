import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubcriberDto } from "./dto/create-subcriber.dto";
import { UpdateSubcriberDto } from "./dto/update-subcriber.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Subcriber, SubcriberDocument } from "./schemas/subcriber.schema";

@Injectable()
export class SubcribersService {
  constructor(@InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>) {}

  async create(createSubcriberDto: CreateSubcriberDto): Promise<Subcriber> {
    const createdSubcriber = new this.subcriberModel(createSubcriberDto);
    return await createdSubcriber.save();
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.subcriberModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("")
      .sort({ createdAt: "desc" });
    const totalItems = await this.subcriberModel.countDocuments();
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

  async findOne(id: string): Promise<Subcriber> {
    const Subcriber = await this.subcriberModel.findById(id).exec();
    if (!Subcriber) {
      throw new NotFoundException(`Subcriber with ID ${id} not found`);
    }
    return Subcriber;
  }

  async update(id: string, updateSubcriberDto: UpdateSubcriberDto): Promise<Subcriber> {
    const updatedSubcriber = await this.subcriberModel.findByIdAndUpdate(id, updateSubcriberDto, { new: true }).exec();
    if (!updatedSubcriber) {
      throw new NotFoundException(`Subcriber with ID ${id} not found`);
    }
    return updatedSubcriber;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subcriberModel.findByIdAndDelete(id).exec();
    if (result === null) {
      throw new NotFoundException(`Subcriber with ID ${id} not found`);
    }
  }
}
