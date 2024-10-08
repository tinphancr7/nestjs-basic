import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { User } from "src/modules/auth/decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { ObjectIdTransformPipe } from "src/pipes/objectid-transform.pipe";
import { ApiTags } from "@nestjs/swagger";

@Controller("jobs")
@ApiTags("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage("Create a new job")
  @Post()
  create(@Body(new ObjectIdTransformPipe()) createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @ResponseMessage("Fetch all jobs with paginate")
  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;

    return this.jobsService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @ResponseMessage("Fetch a resume by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Update a resume by id")
  @Put(":id")
  update(@Param("id") id: string, @Body(new ObjectIdTransformPipe()) updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Delete a resume by id")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobsService.remove(id);
  }
}
