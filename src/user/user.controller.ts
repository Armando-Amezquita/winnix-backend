import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  // Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // @Get()
  // findAll(@Query() paginationDto: PaginationDto) {
  //   return this.userService.findAll(paginationDto);
  // }

  @Get(':term')
  findOneUser(@Param('term') term: string) {
    return this.userService.findOneByTermUser(term);
  }
}
