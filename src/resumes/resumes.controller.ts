import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from "@nestjs/common";

import { ResumesService } from "./resumes.service";
import { CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { IUser } from "src/users/users.interface";
import { User } from "src/auth/decorators/user.decorator";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { PoliciesGuard } from "src/casl/policies.guard";
import { Action } from "src/casl/action.enum";
import { CheckPolicies } from "src/casl/policies.decorator";
import { Resume } from "./schemas/resume.schema";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Resume))
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
  @CheckPolicies((ability: any) => ability.can(Action.Read, Resume))
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
