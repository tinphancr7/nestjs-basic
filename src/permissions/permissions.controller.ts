import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { IUser } from "src/users/users.interface";
import { User } from "src/auth/decorators/user.decorator";

@Controller("permissions")
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
    const { page = 1, limit = 10 } = query;
    return this.permissionsService.findAll({
      page: +page,
      limit: +limit,
    });
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
