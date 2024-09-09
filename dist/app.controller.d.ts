import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { ConcertService } from './concerts/concerts.service';
export declare class AppController {
    private readonly appService;
    private readonly usersService;
    private readonly concertService;
    constructor(appService: AppService, usersService: UsersService, concertService: ConcertService);
    createConcert(req: any, res: any): any;
    homepage(req: any, res: any, session: any): Promise<void>;
    getConcertById(id: string, res: any): Promise<any>;
    deleteUser(id: string, res: any, session: any): Promise<void>;
    update(userId: string, userRole: string, userEmail: string, userName: string, res: any, session: any): Promise<any>;
    addBookedTicket(id: string, res: any, session: any): Promise<any>;
    events(req: any, res: any): Promise<void>;
    profil(req: any, res: any, session: any): Promise<void>;
    about(req: any, res: any): any;
    contact(req: any, res: any): any;
    getHello(): {
        message: string;
    };
    signin(): {
        message: string;
    };
    dashboard(session: any, res: any): Promise<void>;
    getAllConcerts(): Promise<{
        concerts: import("./concerts/concerts.model").Concert[];
    }>;
    addUser(userPassword: string, userName: string, userEmail: string, rememberMe: string, res: any): Promise<any>;
    updateUser(userPassword: string, userEmail: string, res: any, session: any): Promise<any>;
    login(body: {
        username: string;
        password: string;
    }, res: any, req: any, session: any): Promise<void>;
    logout(req: any, res: any, session: any): any;
}
