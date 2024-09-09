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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'tetefelix0@gmail.com',
                pass: 'sdir ntdw yvyg llpp',
            },
        });
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async insertUser(userName, userEmail, password) {
        const username = userName.toLowerCase();
        const email = userEmail.toLowerCase();
        const newUser = new this.userModel({
            username,
            email,
            password,
        });
        await newUser.save();
        return newUser;
    }
    async findByUsername(username) {
        return this.userModel.findOne({ username }).exec();
    }
    async getUser(userName) {
        const username = userName.toLowerCase();
        const user = await this.userModel.findOne({ username });
        return user;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async deleteUser(userId) {
        try {
            const result = await this.userModel.findByIdAndDelete(userId);
            if (!result) {
                throw new Error('Utilisateur non trouvé');
            }
            return { message: 'Utilisateur supprimé avec succès' };
        }
        catch (error) {
            throw new Error("Erreur lors de la suppression de l'utilisateur : " + error.message);
        }
    }
    async login(username, password) {
        const user = await this.findByUsername(username);
        if (!user) {
            throw new common_1.HttpException("Nom d'utilisateur invalide", common_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Mot de Passe Invalide', common_1.HttpStatus.UNAUTHORIZED);
        }
        return {
            message: 'Connexion réussie',
            user: {
                id: user._id,
                username: user.username,
            },
        };
    }
    async updateUserEmailAndPassword(userId, newEmail, newPassword) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
            }
            user.email = newEmail;
            user.password = newPassword;
            await user.save();
            return true;
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            return false;
        }
    }
    async updateUser(userId, newEmail, newRole, Username) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
            }
            user.email = newEmail;
            user.username = Username;
            user.role = newRole;
            await user.save();
            return true;
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            return false;
        }
    }
    async addConcertTicket(userId, concertId) {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { $addToSet: { tickets: concertId } }, { new: true, runValidators: true });
        if (!updatedUser) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return updatedUser;
    }
    async getUserTickets(userId) {
        const user = await this.userModel.findById(userId).select('tickets');
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async sendTicketReservationEmail(userId, ticketInfo) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const ticket = ticketInfo;
        const mailOptions = {
            from: 'tetefelix0@gmail.com',
            to: user.email,
            subject: 'Réservation de votre ticket de concertauprès de  FestivalHub',
            text: `Bonjour ${user['username']}, voici les informations de votre ticket réservé : ${ticketInfo}`,
            html: `
      <html>
        <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
        @import url("https://fonts.googleapis.com/css2?family=Staatliches&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap");

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body,
html {
	height: 100vh;
	display: grid;
	/* background: #d83565;
	color: black;
	font-size: 14px; 
	letter-spacing: 0.1em; */
}

.ticket {
	margin: auto;
	display: flex;
	background: white;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
}

.left {
	display: flex;
}

.image {
	height: auto;
	width: auto;
	background-image: url("https://c8.alamy.com/compfr/jxpa33/musique-live-concert-festival-de-l-affiche-banner-jxpa33.jpg");
	background-size: cover;
	opacity: 0.85;
}

.admit-one {
	position: absolute;
	color: darkgray;
	height: 250px;
	padding: 0 10px;
	letter-spacing: 0.15em;
	display: flex;
	text-align: center;
	justify-content: space-around;
	writing-mode: vertical-rl;
	transform: rotate(-180deg);
}

.admit-one span:nth-child(2) {
	color: white;
	font-weight: 700;
}

.left .ticket-number {
	height: 250px;
	width: 250px;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	padding: 5px;
}

.ticket-info {
	padding: 10px 30px;
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: space-between;
	align-items: center;
}

.date {
	border-top: 1px solid gray;
	border-bottom: 1px solid gray;
	padding: 5px 0;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.date span {
	width: 100px;
}

.date span:first-child {
	text-align: left;
}

.date span:last-child {
	text-align: right;
}

.date .june-29 {
	color: #d83565;
	font-size: 20px;
}

.show-name {
	font-size: 32px;
	font-family: "Nanum Pen Script", cursive;
	color: #d83565;
}

.show-name h1 {
	font-size: 48px;
	font-weight: 700;
	letter-spacing: 0.1em;
	color: #4a437e;
}

.time {
	padding: 10px 0;
	color: #4a437e;
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 10px;
	font-weight: 700;
}

.time span {
	font-weight: 400;
	color: gray;
}

.left .time {
	font-size: 16px;
}


.location {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	padding-top: 8px;
	border-top: 1px solid gray;
}

.location .separator {
	font-size: 20px;
}

.right {
	width: 180px;
	border-left: 1px dashed #404040;
}

.right .admit-one {
	color: darkgray;
}

.right .admit-one span:nth-child(2) {
	color: gray;
}

.right .right-info-container {
	height: 250px;
	padding: 10px 10px 10px 35px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.right .show-name h1 {
	font-size: 18px;
}

.barcode {
	height: 100px;
}

.barcode img {
	height: 100%;
}

.right .ticket-number {
	color: gray;
}

    </style>
        </head>
        <body class="bg-gray-100">
          <h1>Bonjour ${user.username}</h1>
          <section class="py-2"></section>
    <h2 class="text-3xl font-bold mb-6 text-center">Votre Réservation</h2>
    <div class="ticket created-by-anniedotexe py-2">
        <div class="left">
            <div class="image">
                <p class="admit-one">
                    <span class="font-sm text-blue-600">FestivalHub</span>
                    <span class="font-sm text-blue-600">FestivalHub</span>
                </p>
                <div class="ticket-number center">
                    <p class="text-sm text-white text-center">
                        ${ticket._id}
                    </p>
                </div>
            </div>
            <div class="ticket-info">
                <p class="date">
                    <span>${ticket.date.toLocaleString('fr-FR', { weekday: 'long' }).toUpperCase()}</span></span>
                    <span class="june-29">${ticket.date.getDate()} ${ticket.date.toLocaleString('fr-FR', { month: 'long' }).toUpperCase()}</span>
                    <span>${ticket.date.getFullYear()}</span>
                </p>
                <div class="show-name">
                    <h2 class="text-4xl py-2">${ticket.name}</h2>
                    <h2 class="text-2xl py-2">${ticket.description}</h2>
                </div>
                <div class="time">
                    <p>${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })}<span> A </span>${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'Etc/GMT+10' })}</p>
                    <p>PORTES <span>@</span> ${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'Etc/GMT-2' })}</p>
                </div>
                <p class="location"><span>${ticket.location}</span>
                    <span class="separator"><i class="far fa-smile"></i></span><span>${ticket.location}</span>
                </p>
            </div>
        </div>
        <div class="right">
            <p class="admit-one">
                <span class="font-sm text-blue-600">FestivalHub</span>
                <span class="font-sm text-blue-600">FestivalHub</span>
            </p>
            <div class="right-info-container">
                <div class="show-name">
                    <h1>SOUR Prom</h1>
                </div>
                <div class="time">
                    <p><span>DE </span> ${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })} <span>A</span> ${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'Etc/GMT+10' })}</p>
                    <p>PORTES <span>@</span> ${ticket.date.toLocaleTimeString('fr-FR', { timeZone: 'Etc/GMT-2' })}</p>
                </div>
                <div class="barcode">
                    <img src="https://external-preview.redd.it/cg8k976AV52mDvDb5jDVJABPrSZ3tpi1aXhPjgcDTbw.png?auto=webp&s=1c205ba303c1fa0370b813ea83b9e1bddb7215eb" alt="QR code">
                </div>
                <!-- <p class="ticket-number text-sm text-blue-600">
                   #${ticket._id}
                </p> -->
            </div>
        </div>
    </div>
        </div>
        <% }) %>
    </section>



          <p>Voici les informations de votre ticket réservé :</p>
          <div class="ticket-info">
            <p>${ticketInfo.name}</p>
          </div>
        </body>
      </html>`,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map