import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { TagResponseDto } from './dto/tag-response.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagsRepository.find({ order: { name: 'ASC' } });
    return tags.map((tag) => ({ id: tag.id, name: tag.name }));
  }
}
