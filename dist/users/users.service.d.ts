import { Model } from 'mongoose';
import { User } from './users.model';
export declare class UsersService {
    private readonly userModel;
    private transporter;
    constructor(userModel: Model<User>);
    findAll(): Promise<User[]>;
    insertUser(userName: string, userEmail: string, password: string): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    findByUsername(username: string): Promise<User | null>;
    getUser(userName: string): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    findById(id: string): Promise<User>;
    deleteUser(userId: any): Promise<{
        message: string;
    }>;
    login(username: string, password: string): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
        };
    }>;
    updateUserEmailAndPassword(userId: string, newEmail: string, newPassword: string): Promise<any>;
    updateUser(userId: string, newEmail: string, newRole: string, Username: string): Promise<any>;
    addConcertTicket(userId: string, concertId: string): Promise<User>;
    getUserTickets(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    sendTicketReservationEmail(userId: string, ticketInfo: any): Promise<void>;
}
