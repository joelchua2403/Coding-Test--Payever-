import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

 
    @Post()
    createUser(@Body() user: any) {
      return this.userService.createUser(user);
    }
    
    @Get(':userId')
    getUser(@Param('userId') userId: string) {
      return this.userService.getUser(userId);
    }
  
    @Get(':userId/avatar')
    getAvatar(@Param('userId') userId: string) {
        return this.userService.getUserAvatar(userId);
    }
  
    @Delete(':userId/avatar')
    deleteAvatar(@Param('userId') userId: string) {
        return this.userService.deleteUserAvatar(userId);
    }

}