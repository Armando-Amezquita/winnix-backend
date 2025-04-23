import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  isValidObjectId,
  Model,
  ProjectionType,
  QueryOptions,
} from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseRepository } from 'src/common/database/base-repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResponse } from 'src/common/interfaces/pagination-response.interface';
import { SequenceService } from 'src/common/services/sequency.service';

@Injectable()
export class UserService extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly sequenceService: SequenceService,
  ) {
    super(userModel);
  }

  /**
   * Crea un nuevo usuario asignando un ID incremental único.
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const nextIncrementalId =
      await this.sequenceService.getNextSequenceValue('userSequence');

    const userDataWithId = {
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      incremental: nextIncrementalId,
    };

    return await super.create(userDataWithId);
  }

  async findAllUsers(
    paginationDto: PaginationDto,
    filter: FilterQuery<UserDocument> = {},
    projection?: ProjectionType<UserDocument> | null,
    options?: QueryOptions<UserDocument> | null,
  ): Promise<IPaginatedResponse<Partial<UserDocument>>> {
    return super.paginate(filter, paginationDto, projection, options);
  }

  async findOneByTermUser(term: string): Promise<UserDocument> {
    const query = isValidObjectId(term)
      ? { _id: term }
      : { $or: [{ nickname: term }, { email: term }, { name: term }] };

    const user: UserDocument = await this.userModel.findOne(query).exec();

    if (!user)
      throw new NotFoundException(`No user found with identifier: "${term}"`);

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user: UserDocument | null = await this.userModel
      .findOne({ email })
      .exec();
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }
}
