"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const users_service_1 = require("./users/users.service");
const bcrypt = require("bcrypt");
const concerts_service_1 = require("./concerts/concerts.service");
let AppController = class AppController {
    constructor(appService, usersService, concertService) {
        this.appService = appService;
        this.usersService = usersService;
        this.concertService = concertService;
    }
    createConcert(req, res) {
        res.render('frontend/concerts/create', { message: 'Bon retour!' });
    }
    async homepage(req, res, session) {
        const concerts = await this.concertService.findAll();
        const user = await this.usersService.findById(session.userId);
        res.render('frontend/account/index', {
            concerts,
            userId: session.userId,
            user,
        });
    }
    async getConcertById(id, res) {
        try {
            const concert = await this.concertService.findById(id);
            console.log(concert);
            if (!concert) {
                throw new common_1.HttpException('Concert not found', common_1.HttpStatus.NOT_FOUND);
            }
            return res.render('frontend/account/concert_detail', {
                concert,
                message: '',
            });
        }
        catch (error) {
            return error;
        }
    }
    async deleteUser(id, res, session) {
        const deleting = await this.usersService.deleteUser(id);
        console.log(deleting);
        session.userId = '';
        res.redirect('/dashboard');
    }
    async update(userId, userRole, userEmail, userName, res, session) {
        const user = await this.usersService.findById(session.userId);
        if (user) {
            if (userName == '') {
                userName = user.username;
            }
            const result = this.usersService.updateUser(userId, userEmail, userRole, userName.toLowerCase());
            if (result) {
                return res.redirect('/dashboard');
            }
            else {
                return { message: 'An error occured' };
            }
        }
        else {
            return res.redirect('/');
        }
    }
    async addBookedTicket(id, res, session) {
        if (session.userId) {
            const bookedTicket = await this.usersService.addConcertTicket(session.userId, id);
            console.log(bookedTicket);
            const concert = await this.concertService.findById(id);
            const notif = await this.usersService.sendTicketReservationEmail(session.userId, concert);
            console.log(notif);
            return res.render('frontend/account/concert_detail', {
                message: 'Le ticket a été ajouté avec succès',
                concert,
            });
        }
        else {
            return res.redirect('/');
        }
    }
    async events(req, res) {
        const concerts = await this.concertService.findAll();
        res.render('frontend/account/events', { concerts });
    }
    async profil(req, res, session) {
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
        }
        else {
            res.redirect('/');
        }
    }
    about(req, res) {
        res.render('frontend/account/about', { message: 'Bon retour!' });
    }
    contact(req, res) {
        res.render('frontend/account/contact', { message: 'Bon retour!' });
    }
    getHello() {
        return { message: '' };
    }
    signin() {
        return { message: '' };
    }
    async dashboard(session, res) {
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
        }
        else {
            res.redirect('/');
        }
    }
    async getAllConcerts() {
        const concerts = await this.concertService.findAll();
        return { concerts };
    }
    async addUser(userPassword, userName, userEmail, rememberMe, res) {
        if (userPassword == '') {
            res.render('frontend/account/register', {
                message: 'Veuillez entrer un mot de passe!',
            });
        }
        else if (userName == '') {
            res.render('frontend/account/register', {
                message: "Veuillez entrer un nom d'utilisateur",
            });
        }
        else if (rememberMe === 'false') {
            res.render('frontend/account/register', {
                message: "Veuillez accepter les conditions d'utilisation",
            });
        }
        else {
            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
            const result = await this.usersService.insertUser(userName, userEmail, hashedPassword);
            if (result) {
                return res.redirect('/login');
            }
            else {
                return { message: 'An error occured' };
            }
        }
    }
    async updateUser(userPassword, userEmail, res, session) {
        const user = await this.usersService.findById(session.userId);
        if (user) {
            if (userPassword == '') {
                userPassword = user.password;
            }
            else {
                const saltOrRounds = 10;
                const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
                userPassword = hashedPassword;
            }
            const result = this.usersService.updateUserEmailAndPassword(user._id, userEmail.toLowerCase(), userPassword);
            if (result) {
                return res.redirect('/login');
            }
            else {
                return { message: 'An error occured' };
            }
        }
        else {
            return res.redirect('/');
        }
    }
    async login(body, res, req, session) {
        const testConnexion = this.usersService.login(body.username.toLowerCase(), body.password);
        try {
            const user = await this.usersService.getUser((await testConnexion).user.username);
            if (user) {
                const userId = user._id;
                session.userId = userId;
            }
            const userRole = user['role'];
            if (userRole == 'user') {
                session.userId = user.id;
                res.redirect('/');
            }
            else if (userRole == 'admin') {
                session.userId = user.id;
                res.redirect('/dashboard');
            }
        }
        catch (e) {
            const result = e.message;
            console.log(result);
            res.render('frontend/account/login', {
                message: result,
            });
        }
    }
    logout(req, res, session) {
        session.userId = '';
        req.session.destroy();
        res.redirect('/');
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/concerts/create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AppController.prototype, "createConcert", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "homepage", null);
__decorate([
    (0, common_1.Get)('concerts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConcertById", null);
__decorate([
    (0, common_1.Get)('/deleteuser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('/updateuser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('username')),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('booking/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addBookedTicket", null);
__decorate([
    (0, common_1.Get)('/events'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "events", null);
__decorate([
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "profil", null);
__decorate([
    (0, common_1.Get)('/about'),
    (0, common_1.Render)('frontend/about'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AppController.prototype, "about", null);
__decorate([
    (0, common_1.Get)('/contact'),
    (0, common_1.Render)('frontend/contact'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AppController.prototype, "contact", null);
__decorate([
    (0, common_1.Get)('/register'),
    (0, common_1.Render)('frontend/account/register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/login'),
    (0, common_1.Render)('frontend/account/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('/dashboard'),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('/concerts'),
    (0, common_1.Render)('frontend/concerts/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllConcerts", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)('password')),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('checkBox')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addUser", null);
__decorate([
    (0, common_1.Post)('/profil/update'),
    __param(0, (0, common_1.Body)('password')),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], AppController.prototype, "logout", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        users_service_1.UsersService,
        concerts_service_1.ConcertService])
], AppController);
//# sourceMappingURL=app.controller.js.map