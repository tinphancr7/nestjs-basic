import { Injectable } from "@nestjs/common";
import { UpdateMailDto } from "./dto/update-mail.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendJobNotificationEmail(
    user: { name: string; email: string },
    job: { jobTitle: string; company: string; salary: string; skills: string; jobLink: string },
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: "New Frontend Job in Ho Chi Minh",
      template: "job-notification", // template name (relative to `template.dir`)
      context: {
        // data to be injected into the template
        name: user.name,
        jobTitle: job.jobTitle,
        company: job.company,
        salary: job.salary,
        skills: job.skills,
        jobLink: job.jobLink,
      },
    });
  }
  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
