import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./users.interface";
import { User } from "src/auth/decorators/user.decorator";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;
    return this.usersService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Get(":id")
  @ResponseMessage("Fetch a user by id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update a user by id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a user by id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
