import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  createPaginatedSuccessResponse,
  createSuccessResponse,
} from 'src/common/helpers/responses/response-helper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.userService.createUser(createUserDto);
    return createSuccessResponse(response, 'Register user successful');
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const response = await this.userService.findAllUsers(paginationDto);
    return createPaginatedSuccessResponse(response);
  }

  @Get(':term')
  findOneUser(@Param('term') term: string) {
    return this.userService.findOneByTermUser(term);
  }
}
