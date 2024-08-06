import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/modules/users/schemas/user.schema";
import { Role, RoleDocument } from "src/modules/roles/schemas/role.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Permission, PermissionDocument } from "src/modules/permissions/schemas/permission.schema";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}
  async onModuleInit() {
    // const isInit = this.configService.get<string>("SHOULD_INIT");
    // if (Boolean(isInit)) {
    //   const countUser = await this.userModel.countDocuments();
    //   const countPermission = await this.permissionModel.countDocuments();
    //   const countRole = await this.roleModel.countDocuments();
    //   // Create permissions
    //   if (!countPermission) {
    //     await this.createFakePermissions();
    //   }
    //   // Create roles
    //   if (!countRole) {
    //     await this.createFakeRoles();
    //   }
    //   // Create users
    //   if (!countUser) {
    //     await this.createFakeUsers();
    //   }
    // }
  }

  async createFakePermissions() {
    const permissions = [];
    for (let i = 0; i < 10; i++) {
      permissions.push({
        name: faker.lorem.word(),
        apiPath: faker.internet.url(),
        method: faker.helpers.arrayElement(["GET", "POST", "PUT", "DELETE"]),
        module: faker.lorem.word(),
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
      });
    }
    await this.permissionModel.insertMany(permissions);
  }

  async createFakeRoles() {
    const permissions = await this.permissionModel.find().exec();
    const roles = [];
    for (let i = 0; i < 5; i++) {
      roles.push({
        name: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        isActive: true,
        permissions: permissions.map((permission) => permission._id),
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
      });
    }
    await this.roleModel.insertMany(roles);
  }

  async createFakeUsers() {
    const roles = await this.roleModel.find().exec();
    const users = [];
    for (let i = 0; i < 20; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.number.int({ min: 18, max: 60 }),
        gender: faker.helpers.arrayElement(["Male", "Female"]),
        address: faker.address.streetAddress(),
        phone: faker.phone.number(),
        company: null,
        role: faker.helpers.arrayElement(roles)._id,
        refresh_token: faker.string.uuid(),
      });
    }
    await this.userModel.insertMany(users);
  }
}
