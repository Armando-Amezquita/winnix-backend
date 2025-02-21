import { PaginationDto } from './../common/dto/pagination.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      if (error.code === 11000)
        throw new BadRequestException(
          `A user with the email "${error.keyValue.email}" already exists. Please use a different email.`,
        );

      throw new InternalServerErrorException(`Can't create user`);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return `This action returns all user`;
  }

  async findOne(term: string) {
    const query = isValidObjectId(term)
      ? { _id: term }
      : { $or: [{ nickname: term }, { email: term }, { name: term }] };

    const user: User = await this.userModel.findOne(query);

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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
