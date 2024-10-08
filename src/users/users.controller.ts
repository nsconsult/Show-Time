import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //post / signup
  @Post('/signup')
  async addUser(
    @Body('password') userPassword: string,
    @Body('username') userName: string,
    @Body('email') userEmail: string,
  ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
    const result = await this.usersService.insertUser(
      userName,
      userEmail,
      hashedPassword,
    );
    return {
      msg: 'User successfully registered',
      userId: result.id,
      userName: result.username,
      userEmail: result.email,
    };
  }
  //Post / Login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return { User: req.user, msg: 'User logged in' };
  }
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }
  //Get / logout
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
