import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./schemas/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/users/users.interface";
import { toObjectId } from "src/utils";
import { ADMIN_ROLE } from "src/constant";
import { BaseService } from "src/base/base.service";

@Injectable()
export class RolesService extends BaseService<RoleDocument> {
  constructor(@InjectModel(Role.name) private rolesModel: SoftDeleteModel<RoleDocument>) {
    super(rolesModel);
  }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const isExist = await this.rolesModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException("Role already exists");
    }
    return this.createData({
      name,
      description,
      isActive,
      permissions: permissions.map((permission) => toObjectId(permission)),
      createdBy: toObjectId(user?._id),
    });
  }

  async findAll({ page, limit }) {
    return this.findAllData({
      query: {
        page,
        limit,
      },
      populate: [{ path: "createdBy", select: { name: 1, role: 1, email: 1 } }],
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [
        { path: "createdBy" },
        {
          path: "permissions",
          select: { name: 1, apiPath: 1, method: 1, module: 1 },
        },
      ],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updateRoleDto,
        updatedBy: toObjectId(user._id),
      },
    });
  }

  async remove(id: string) {
    const foundRole = await this.rolesModel.findById(id);
    if (foundRole?.name === ADMIN_ROLE) {
      throw new BadRequestException("Not allowed to remove admin role");
    }
    return this.removeData({
      id,
    });
  }
}
