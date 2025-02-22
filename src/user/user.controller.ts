import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @Get()
  // findAll(@Query() paginationDto: PaginationDto) {
  //   return this.userService.findAll(paginationDto);
  // }

  @Get(':term')
  findOneUser(@Param('term') term: string) {
    return this.userService.findOneByTermUser(term);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
