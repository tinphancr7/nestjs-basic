import { Controller, Post, Body, Get, Param, Query } from "@nestjs/common";

// INNER
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

import { IUser } from "../users/users.interface";
import { User } from "../auth/decorators/user.decorator";
import { ObjectIdTransformPipe } from "src/pipes/objectid-transform.pipe";
import { toObjectId } from "src/utils";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body(new ObjectIdTransformPipe()) createCommentDto: CreateCommentDto, @User() user: IUser) {
    return await this.commentsService.create(createCommentDto, user);
  }
  @Get()
  async getAllComments() {
    return await this.commentsService.findAll(
      { target_id: toObjectId("66aa2e84856a1ea3ac5c4887") },
      { offset: 0, limit: 10, sort_type: -1, including_children: true },
    );
  }

  @Get(":comment_id")
  async getAllSubComments(
    @Param("comment_id") comment_id: string,
    @Query("target_id", new ObjectIdTransformPipe()) target_id: string,
    @Query("deep_level") deep_level: number,
  ) {
    return this.commentsService.getAllSubComments(
      {
        target_id,
        parent_id: comment_id,
      },
      deep_level,
    );
  }
}
