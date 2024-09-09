import { ConcertService } from './concerts.service';
import { Response } from 'express';
export declare class ConcertController {
    private readonly concertService;
    constructor(concertService: ConcertService);
    createConcertForm(): {};
    getAllConcerts(): Promise<{
        concerts: import("./concerts.model").Concert[];
    }>;
    getConcertById(id: string, res: Response): Promise<Response<any, Record<string, any>> | {
        concert: import("./concerts.model").Concert;
    }>;
    createConcert(name: string, date: Date, location: string, genre: string, description: string, price: number, picture: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    editConcertForm(id: string, res: Response): Promise<Response<any, Record<string, any>> | {
        concert: import("./concerts.model").Concert;
    }>;
    updateConcert(id: string, updateConcertDto: any, picture: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteConcert(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
