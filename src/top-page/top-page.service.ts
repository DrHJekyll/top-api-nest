import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel.findOne({ alias }).exec();
  }

  async findByCategory(
    firstCategory: TopLevelCategory,
  ): Promise<DocumentType<TopPageModel>[]> {
    return await this.topPageModel
      .aggregate()
      .match({ firstCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } },
      })
      // .aggregate([
      //   {
      //     $match: {
      //       firstCategory,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         secondCategory: '$secondCategory',
      //       },
      //       pages: { $push: { alias: '$alias', title: '$title' } },
      //     },
      //   },
      // ])
      .exec();
  }

  async findByText(text: string): Promise<DocumentType<TopPageModel>[]> {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
}
