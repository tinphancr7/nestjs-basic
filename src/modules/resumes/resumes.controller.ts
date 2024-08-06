import { Controller, Get, Post, Body, Put, Param, Delete, Query } from "@nestjs/common";

import { ResumesService } from "./resumes.service";
import { CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { IUser } from "src/modules/users/users.interface";
import { User } from "src/modules/auth/decorators/user.decorator";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("resumes")
@ApiTags("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create a new resume")
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }
  @Post("by-user")
  @ResponseMessage("Get resume by user")
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }

  @Get()
  @ResponseMessage("Fetch all resumes with paginate")
  findAll(@Query() query: any) {
    const { page = 1, limit = 10 } = query;
    return this.resumesService.findAll({
      page: +page,
      limit: +limit,
    });
  }

  @Get(":id")
  @ResponseMessage("Fetch a resume by id")
  findOne(@Param("id") id: string) {
    return this.resumesService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update status resume")
  updateStatus(@Param("id") id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a resume by id")
  remove(@Param("id") id: string) {
    return this.resumesService.remove(id);
  }
}
