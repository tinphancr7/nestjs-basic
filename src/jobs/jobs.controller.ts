import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage("Job successfully created")
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Public()
  @ResponseMessage("Jobs successfully retrieved")
  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;

    return this.jobsService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @ResponseMessage("Job successfully retrieved")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Job successfully updated")
  @Put(":id")
  update(@Param("id") id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @ResponseMessage("Job successfully deleted")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobsService.remove(id);
  }
}
