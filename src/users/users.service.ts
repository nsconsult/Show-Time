import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter; // Déclaration de la propriété transporter
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // ou true pour le port 465
      auth: {
        user: 'tetefelix0@gmail.com',
        pass: 'sdir ntdw yvyg llpp',
      },
    });
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async insertUser(userName: string, userEmail: string, password: string) {
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
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async getUser(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    // cont alpha = await this.userModel.findOneAndRemove({})
    return user;
  }
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async deleteUser(userId) {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      if (!result) {
        throw new Error('Utilisateur non trouvé');
      }
      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      throw new Error(
        "Erreur lors de la suppression de l'utilisateur : " + error.message,
      );
    }
  }
  //
  async login(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new HttpException(
        "Nom d'utilisateur invalide",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Mot de Passe Invalide', HttpStatus.UNAUTHORIZED);
    }
    // Logique de génération de token ou retour d'information utilisateur
    return {
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
      },
    };
  }

  async updateUserEmailAndPassword(
    userId: string,
    newEmail: string,
    newPassword: string,
  ): Promise<any> {
    // const userRepository = getRepository(User); // Récupérer le dépôt d'utilisateurs

    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        // throw new Error('Utilisateur non trouvé');
      }

      // Mettez à jour l'email et le mot de passe
      user.email = newEmail;
      user.password = newPassword; // Assurez-vous de hacher le mot de passe avant de le sauvegarder
      await user.save();

      return true; // Mise à jour réussie
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return false; // Échec de la mise à jour
    }
  }
  async updateUser(
    userId: string,
    newEmail: string,
    newRole: string,
    Username: string,
  ): Promise<any> {
    // const userRepository = getRepository(User); // Récupérer le dépôt d'utilisateurs

    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        // throw new Error('Utilisateur non trouvé');
      }

      // Mettez à jour l'email et le mot de passe
      user.email = newEmail;
      user.username = Username;
      user.role = newRole; // Assurez-vous de hacher le mot de passe avant de le sauvegarder
      await user.save();

      return true; // Mise à jour réussie
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return false; // Échec de la mise à jour
    }
  }
  async addConcertTicket(userId: string, concertId: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { tickets: concertId } }, // Utiliser $addToSet pour éviter les doublons
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return updatedUser; // Renvoie l'utilisateur mis à jour avec le nouveau ticket
  }
  async getUserTickets(userId: string) {
    const user = await this.userModel.findById(userId).select('tickets');
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
    // return user; // Renvoie les tickets de l'utilisateur
  }
  async sendTicketReservationEmail(
    userId: string,
    ticketInfo: any,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
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
}
