import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    addUser(userPassword: string, userName: string, userEmail: string): Promise<{
        msg: string;
        userId: any;
        userName: string;
        userEmail: string;
    }>;
    login(req: any): any;
    getHello(req: any): string;
    logout(req: any): any;
}
