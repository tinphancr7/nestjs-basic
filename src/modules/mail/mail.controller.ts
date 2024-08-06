import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MailService } from "./mail.service";
import { CreateMailDto } from "./dto/create-mail.dto";
import { UpdateMailDto } from "./dto/update-mail.dto";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("mail")
@ApiTags("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post("send-job-notification")
  @ResponseMessage("Test email")
  async sendJobNotification(
    @Body()
    body: {
      user: { name: string; email: string };
      job: { jobTitle: string; company: string; salary: string; skills: string; jobLink: string };
    },
  ) {
    return this.mailService.sendJobNotificationEmail(body.user, body.job);
  }
  // async handleTestEmail() {
  //   await this.mailerService.sendMail({
  //     to: "tin.phanbk19@hcmut.edu.vn",
  //     from: "Support Team <support@example.com>",
  //     subject: "Welcome to Nice App! Confirm your Email",
  //     template: "test",
  //   });
  // }

  @Get()
  findAll() {
    return this.mailService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.mailService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMailDto: UpdateMailDto) {
    return this.mailService.update(+id, updateMailDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.mailService.remove(+id);
  }
}
