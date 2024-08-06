import { Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Company, CompanyDocument } from "./schemas/company.schema";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "src/modules/users/users.interface";
import { BaseService } from "src/base/base.service";
import { toObjectId } from "src/utils";

@Injectable()
export class CompaniesService extends BaseService<CompanyDocument> {
  constructor(@InjectModel(Company.name) private readonly companyModel: SoftDeleteModel<CompanyDocument>) {
    super(companyModel);
  }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.createData({
      ...createCompanyDto,
      createdBy: toObjectId(user?._id),
    });
  }

  async findAll({ page, limit }) {
    return this.findAllData({
      query: {
        page,
        limit,
      },
      populate: { path: "createdBy", select: { name: 1, role: 1, email: 1 } },
    });
  }

  findOne(id: string) {
    return this.findOneData({
      id,
      populate: { path: "createdBy" },
    });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updateCompanyDto,
        updatedBy: toObjectId(user?._id),
      },
    });
  }

  remove(id: string) {
    return this.removeData({
      id,
    });
  }
}
