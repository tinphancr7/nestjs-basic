import { Controller, Post, Body } from "@nestjs/common";

// INNER
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

import { IUser } from "../users/users.interface";
import { User } from "../auth/decorators/user.decorator";
import { ObjectIdTransformPipe } from "src/pipes/objectid-transform.pipe";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body(new ObjectIdTransformPipe()) createCommentDto: CreateCommentDto, @User() user: IUser) {
    return await this.commentsService.create(createCommentDto, user);
  }
}
