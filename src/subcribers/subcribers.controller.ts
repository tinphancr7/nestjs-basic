import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { SubcribersService } from "./subcribers.service";
import { CreateSubcriberDto } from "./dto/create-subcriber.dto";
import { UpdateSubcriberDto } from "./dto/update-subcriber.dto";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("subcribers")
export class SubcribersController {
  constructor(private readonly subcribersService: SubcribersService) {}

  @ResponseMessage("Subcriber successfully created")
  @Post()
  create(@Body() createSubcriberDto: CreateSubcriberDto) {
    return this.subcribersService.create(createSubcriberDto);
  }

  @Public()
  @ResponseMessage("Subcribers successfully retrieved")
  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;

    return this.subcribersService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @ResponseMessage("Subcriber successfully retrieved")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subcribersService.findOne(id);
  }

  @ResponseMessage("Subcriber successfully updated")
  @Put(":id")
  update(@Param("id") id: string, @Body() updateSubcriberDto: UpdateSubcriberDto) {
    return this.subcribersService.update(id, updateSubcriberDto);
  }

  @ResponseMessage("Subcriber successfully deleted")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subcribersService.remove(id);
  }
}
