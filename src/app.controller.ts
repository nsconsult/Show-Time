import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Request,
  // UseGuards,
  Res,
  Session,
  Param,
  HttpException,
  HttpStatus,
  // Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
// import { LocalAuthGuard } from './auth/local.auth.guard';
import { ConcertService } from './concerts/concerts.service';
// import session from 'express-session';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly concertService: ConcertService,
  ) {}
  @Get('/concerts/create')
  createConcert(@Request() req, @Res() res): any {
    res.render('frontend/concerts/create', { message: 'Bon retour!' });
  }
  @Get('/')
  // @Render('frontend/index')
  async homepage(@Request() req, @Res() res, @Session() session) {
    const concerts = await this.concertService.findAll();
    const user = await this.usersService.findById(session.userId);
    res.render('frontend/account/index', {
      concerts,
      userId: session.userId,
      user,
    });
  }
  @Get('concerts/:id')
  // @Render('frontend/account/concert_detail')
  async getConcertById(@Param('id') id: string, @Res() res) {
    try {
      const concert = await this.concertService.findById(id);
      console.log(concert); // Ajoutez cette ligne pour voir ce qui est renvoyé
      if (!concert) {
        throw new HttpException('Concert not found', HttpStatus.NOT_FOUND);
      }
      return res.render('frontend/account/concert_detail', {
        concert,
        message: '',
      });
    } catch (error) {
      return error;
    }
  }
  @Get('/deleteuser/:id')
  async deleteUser(@Param('id') id: string, @Res() res, @Session() session) {
    const deleting = await this.usersService.deleteUser(id);
    console.log(deleting);
    session.userId = '';
    res.redirect('/dashboard');
  }
  @Post('/updateuser/:id')
  async update(
    @Param('id') userId: string,
    @Body('role') userRole: string,
    @Body('email') userEmail: string,
    @Body('username') userName: string,
    @Res() res,
    @Session() session,
    // req,
  ) {
    const user = await this.usersService.findById(session.userId);
    if (user) {
      if (userName == '') {
        userName = user.username;
      }

      const result = this.usersService.updateUser(
        userId,
        userEmail,
        userRole,
        userName.toLowerCase(),
      );
      if (result) {
        return res.redirect('/dashboard');
      } else {
        return { message: 'An error occured' };
      }
    } else {
      return res.redirect('/');
    }
  }
  @Get('booking/:id')
  async addBookedTicket(
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ) {
    if (session.userId) {
      const bookedTicket = await this.usersService.addConcertTicket(
        session.userId,
        id,
      );
      console.log(bookedTicket);
      const concert = await this.concertService.findById(id);
      const notif = await this.usersService.sendTicketReservationEmail(
        session.userId,
        concert,
      );
      console.log(notif);
      return res.render('frontend/account/concert_detail', {
        message: 'Le ticket a été ajouté avec succès',
        concert,
      });
    } else {
      return res.redirect('/');
    }
  }
  @Get('/events')
  async events(@Request() req, @Res() res) {
    const concerts = await this.concertService.findAll();
    res.render('frontend/account/events', { concerts });
  }
  @Get('/profile')
  async profil(@Request() req, @Res() res, @Session() session) {
    if (session.userId) {
      const user = await this.usersService.findById(session.userId);
      const tickets = await this.usersService.getUserTickets(session.userId);
      const bookedList = tickets['tickets'];
      const reservations = [];
      for (let i = 0; i < bookedList.length; i++) {
        const ticket = bookedList[i];
        const concert = await this.concertService.findById(ticket);
        reservations.push(concert);
      }
      res.render('frontend/account/profil', { user, tickets, reservations });
    } else {
      res.redirect('/');
    }
  }
  @Get('/about')
  @Render('frontend/about')
  about(@Request() req, @Res() res): any {
    res.render('frontend/account/about', { message: 'Bon retour!' });
  }
  @Get('/contact')
  @Render('frontend/contact')
  contact(@Request() req, @Res() res): any {
    res.render('frontend/account/contact', { message: 'Bon retour!' });
  }
  // Register Get Route
  @Get('/register')
  @Render('frontend/account/register')
  getHello() {
    return { message: '' };
  }
  // Login Get Route
  @Get('/login')
  @Render('frontend/account/login')
  signin() {
    return { message: '' };
  }
  @Get('/dashboard')
  async dashboard(@Session() session, @Res() res) {
    if (session.userId) {
      const admin = await this.usersService.findById(session.userId);
      const adminRole = admin['role'];
      if (adminRole) {
        const users = await this.usersService.findAll();
        const concerts = await this.concertService.findAll();
        const totalConcerts = concerts.length;
        const totalUsers = users.length;
        res.render('backend/dashboard', {
          totalUsers,
          totalConcerts,
          users,
          concerts,
        });
      }
    } else {
      res.redirect('/');
    }
  }
  @Get('/concerts')
  @Render('frontend/concerts/index')
  async getAllConcerts() {
    const concerts = await this.concertService.findAll();
    return { concerts };
  }
  @Post('/register')
  async addUser(
    @Body('password') userPassword: string,
    @Body('username') userName: string,
    @Body('email') userEmail: string,
    @Body('checkBox') rememberMe: string,
    @Res() res,
    // req,
  ) {
    if (userPassword == '') {
      res.render('frontend/account/register', {
        message: 'Veuillez entrer un mot de passe!',
      });
    } else if (userName == '') {
      res.render('frontend/account/register', {
        message: "Veuillez entrer un nom d'utilisateur",
      });
    } else if (rememberMe === 'false') {
      res.render('frontend/account/register', {
        message: "Veuillez accepter les conditions d'utilisation",
      });
    } else {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
      const result = await this.usersService.insertUser(
        userName,
        userEmail,
        hashedPassword,
      );
      if (result) {
        return res.redirect('/login');
      } else {
        return { message: 'An error occured' };
      }
    }
  }
  // Mise à jour Utilisateur
  @Post('/profil/update')
  async updateUser(
    @Body('password') userPassword: string,
    @Body('email') userEmail: string,
    @Res() res,
    @Session() session,
    // req,
  ) {
    const user = await this.usersService.findById(session.userId);
    if (user) {
      if (userPassword == '') {
        userPassword = user.password;
      } else {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
        userPassword = hashedPassword;
      }

      const result = this.usersService.updateUserEmailAndPassword(
        user._id,
        userEmail.toLowerCase(),
        userPassword,
      );
      if (result) {
        return res.redirect('/login');
      } else {
        return { message: 'An error occured' };
      }
    } else {
      return res.redirect('/');
    }
  }
  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  // @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res,
    @Request() req,
    @Session() session: any,
  ) {
    const testConnexion = this.usersService.login(
      body.username.toLowerCase(),
      body.password,
    ); // Appeler la méthode de login ici
    try {
      const user = await this.usersService.getUser(
        (await testConnexion).user.username,
      );
      if (user) {
        const userId = user._id;
        session.userId = userId; // Assigner une valeur à la variable de session
        // session.userId = user.id;
        // req.session.userId = user.id;
      }
      const userRole = user['role'];
      if (userRole == 'user') {
        session.userId = user.id;
        // res.render('frontend/account/index', { userId: session.userId });
        res.redirect('/');
      } else if (userRole == 'admin') {
        session.userId = user.id;
        res.redirect('/dashboard');
      }
    } catch (e) {
      const result = (e as Error).message;
      console.log(result);
      res.render('frontend/account/login', {
        message: result,
      });
    }
  }
  @Get('/logout')
  logout(@Request() req, @Res() res, @Session() session): any {
    session.userId = '';
    req.session.destroy();
    // req.flash('message', 'You are now logged out.');
    res.redirect('/');
    // return { msg: 'The user session has ended' };
  }
}
