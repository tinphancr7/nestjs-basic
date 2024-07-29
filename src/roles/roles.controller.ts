import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { User } from "src/auth/decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("Create a new Role")
  create(@Body() createUserCvDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all Roles with paginate")
  findAll(@Query() query: any) {
    const { page = 1, limit = 10 } = query;
    return this.rolesService.findAll({
      page: +page,
      limit: +limit,
    });
  }

  @Get(":id")
  @ResponseMessage("Fetch a Role by id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update status Role")
  updateStatus(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a Role by id")
  remove(@Param("id") id: string) {
    return this.rolesService.remove(id);
  }
}
