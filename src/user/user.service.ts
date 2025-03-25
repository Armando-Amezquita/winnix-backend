import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

// import { PaginationDto } from './../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      console.log('error :>> ', error);
      if (error.code === 11000)
        throw new BadRequestException(
          `A user with the email "${error.keyValue.email}" already exists. Please use a different email.`,
        );

      throw new InternalServerErrorException(`Can't create user`);
    }
  }

  // findAll(paginationDto: PaginationDto) {
  //   // const { limit = 10, offset = 0 } = paginationDto;

  //   return `This action returns all user`;
  // }

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
