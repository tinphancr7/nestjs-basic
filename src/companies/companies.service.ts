import { Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Company, CompanyDocument } from "./schemas/company.schema";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "src/users/users.interface";
import { Types } from "mongoose";

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}
  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: new Types.ObjectId(user?._id),
    });
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.companyModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("")
      .sort({ createdAt: "desc" });
    const totalItems = await this.companyModel.countDocuments();
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

  findOne(id: string) {
    return this.companyModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(id),
      },
      {
        ...updateCompanyDto,
        updatedBy: new Types.ObjectId(user?._id),
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.companyModel.findByIdAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}
