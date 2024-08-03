import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Subscriber, SubscriberDocument } from "./schemas/subscriber.schema";
import { IUser } from "src/users/users.interface";

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    const createdSubscriber = new this.subscriberModel(createSubscriberDto);
    return await createdSubscriber.save();
  }

  async getSkills(user: IUser) {
    return await this.subscriberModel.findOne({ email: user.email }, { skills: 1 });
  }
  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.subscriberModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("")
      .sort({ createdAt: "desc" });
    const totalItems = await this.subscriberModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      meta: {
        current: page, // trang hiện tại
        pageSize: limit, // số lượng bản ghi đã lấy
        pages: totalPages, // tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, // kết quả query
    };
  }

  async findOne(id: string) {
    const Subscriber = await this.subscriberModel.findById(id).exec();
    if (!Subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return Subscriber;
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const updatedSubscriber = await this.subscriberModel
      .findByIdAndUpdate({ email: user?.email }, updateSubscriberDto, { upsert: true })
      .exec();
    if (!updatedSubscriber) {
      throw new NotFoundException(`Subscriber not found`);
    }
    return updatedSubscriber;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subscriberModel.findByIdAndDelete(id).exec();
    if (result === null) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
  }
}
