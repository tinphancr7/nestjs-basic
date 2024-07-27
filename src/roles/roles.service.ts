import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./schemas/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/users/users.interface";
import { toObjectId } from "src/utils";
import { ADMIN_ROLE } from "src/constant";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private rolesModel: SoftDeleteModel<RoleDocument>) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const isExist = await this.rolesModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException("Role already exists");
    }
    const newRole: any = await this.rolesModel.create({
      name,
      description,
      isActive,
      permissions: permissions.map((permission) => toObjectId(permission)),
      createdBy: toObjectId(user?._id),
    });
    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.rolesModel.find().skip(skip).limit(limit).lean().populate("").sort({ createdAt: "desc" });
    const totalItems = await this.rolesModel.countDocuments();
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
    const role = await this.rolesModel
      .findById(id)
      .populate({
        path: "permissions",
        select: { name: 1, apiPath: 1, method: 1, module: 1 },
      })
      .exec();

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const updatedResume = await this.rolesModel
      .findByIdAndUpdate(
        id,
        {
          ...updateRoleDto,
          updatedBy: toObjectId(user._id),
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
    const foundRole = await this.rolesModel.findById(id);
    if (foundRole?.name === ADMIN_ROLE) {
      throw new BadRequestException("Not allowed to remove admin role");
    }
    const deletedResume = await this.rolesModel.findByIdAndDelete(id).exec();
    if (!deletedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
  }
}
