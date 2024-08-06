import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { IUser } from "src/modules/users/users.interface";
import { User } from "src/modules/auth/decorators/user.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("permissions")
@ApiTags("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("Create a new permission")
  create(@Body() createUserCvDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all permissions with paginate")
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;
    return this.permissionsService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }
  @Get("by-admin")
  @ResponseMessage("Fetch all permissions with paginate")
  findAllByAdmin() {
    return this.permissionsService.findAllByAdmin();
  }

  @Get(":id")
  @ResponseMessage("Fetch a permission by id")
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update status permission")
  updateStatus(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a permission by id")
  remove(@Param("id") id: string) {
    return this.permissionsService.remove(id);
  }
}
